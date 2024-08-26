import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dtos/create.user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/user/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/providers/email.service';
/**
 * Handle user registration, login, and password hashing:
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // Generate email verification token
  generateEmailVerificationToken(email: string): string {
    const payload = { email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  // Send verification email
  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://your-frontend-url/verify-email?token=${token}`;
    await this.emailService.sendMail(
      email,
      'Email Verification',
      `Please click the link to verify your email: ${verificationLink}`,
    );
  }

  async register(CreateUserDto: CreateUserDto): Promise<User> {
    const { email, password, isTwoFactorEnabled } = CreateUserDto;

    // Check for existing user
    let existingUser: User | undefined = undefined;

    try {
      // Check if user already exists
      existingUser = await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again.',
        {
          description: 'Error connecting to database',
        },
      );
    }

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        email,
        password: hashPassword,
        isTwoFactorEnabled,
      });

      const savedUser = await this.userRepository.save(newUser);

      // Generate and send email verification token
      const token = this.generateEmailVerificationToken(savedUser.email);
      await this.sendVerificationEmail(savedUser.email, token);
      console.log("The token generated:",token);

      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists.');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while registering the user',
        );
      }
    }
  }

  async verifyEmail(token: string) {
    try {
      console.log('Received token:', token); // Log token for debugging
      const decoded = this.jwtService.verify(token);
      console.log('Decoded token:', decoded); // Log decoded token
      const userEmail = decoded.email;
      const user = await this.userRepository.findOne({
        where: { email: userEmail },
      });

      if (user) {
        user.isEmailVerified = true;
        await this.userRepository.save(user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token verification error:', error); // Log error for debugging
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    try {
      // Fetch the user by email
      const user = await this.userRepository.findOne({ where: { email } });

      // Check if the user exists
      if (!user) {
        throw new UnauthorizedException(
          'User with credentials does not exist.',
        );
      }

      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      // Generate JWT token
      const payload = { email: user.email, sub: user.id }; // Adjust payload as needed
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof UnauthorizedException) {
        throw error; // Rethrow UnauthorizedException
      } else {
        throw new InternalServerErrorException(
          'Unable to process your request at the moment',
          'Error connecting to the database',
        );
      }
    }
  }
}

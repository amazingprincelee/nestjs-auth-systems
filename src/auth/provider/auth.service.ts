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
/**
 * Handle user registration, login, and password hashing:
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

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

        return await this.userRepository.save(newUser);
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


async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
  const { email, password } = loginDto;

  try {
      // Fetch the user by email
      const user = await this.userRepository.findOne({ where: { email } });

      // Check if the user exists
      if (!user) {
          throw new UnauthorizedException('User with credentials does not exist.');
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
              'Error connecting to the database'
          );
      }
  }
}

}

// src/twofa/twofa.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { SendEmailDto } from '../dto/send-email.dto';
import { TwoFa } from '../twofa.entity';
import { EmailService } from 'src/email/providers/email.service';

@Injectable()
export class TwoFAService {
  constructor(
    @InjectRepository(TwoFa)
    private twoFARepository: Repository<TwoFa>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async createTwoFAToken(user: User): Promise<void> {
    const token = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a simple 6-digit token

    const twoFA = this.twoFARepository.create({ email: user.email, token });
    await this.twoFARepository.save(twoFA);

    await this.sendVerificationEmail({ email: user.email, token });
  }

  async sendToken(email: string) {
    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.createTwoFAToken(user);
    return await { message: 'Verification token sent to your email' };
  }

  async sendVerificationEmail(sendEmailDto: SendEmailDto) {
    const { email, token } = sendEmailDto;
    await this.emailService.sendMail(
      email,
      'Your 2FA Verification Token',
      `Your verification token is ${token}`,
    );
  }

  async verifyToken(sendEmailDto: SendEmailDto): Promise<boolean> {
    const {email, token} = sendEmailDto
    const record = await this.twoFARepository.findOne({
      where: { email, token },
    });
    return !!record;
  }

  async enable(sendEmailDto: SendEmailDto) {
    // Verify the token
    const isValid = await this.verifyToken(sendEmailDto);
    const {email} = sendEmailDto
    if (!isValid) {
      throw new BadRequestException('Invalid token');
    }

    // Enable 2FA for the user
    await this.userRepository.update({ email }, { isTwoFactorEnabled: true });
    return {
      message: 'Two-factor authentication enabled',
      user: await this.userRepository.findOne({ where: { email } }),
    };
  }

  async disable(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update({ email }, { isTwoFactorEnabled: false });
    return { message: '2FA disabled successfully' };
  }
}

// src/twofa/twofa.service.ts
import { Injectable } from '@nestjs/common';
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
    private emailService: EmailService, // Inject EmailService
  ) {}

  async sendVerificationEmail(sendEmailDto: SendEmailDto) {
    const { email, token } = sendEmailDto;

    // Use the EmailService to send the email
    await this.emailService.sendMail(email, 'Your 2FA Verification Token', `Your verification token is ${token}`);
  }

  async createTwoFAToken(user: User): Promise<void> {
    const token = Math.floor(100000 + Math.random() * 900000).toString(); // Simple 6-digit token
    const twoFA = this.twoFARepository.create({ email: user.email, token });
    await this.twoFARepository.save(twoFA);
    await this.sendVerificationEmail({ email: user.email, token });
  }

  async verifyToken(email: string, token: string): Promise<boolean> {
    const record = await this.twoFARepository.findOne({ where: { email, token } });
    return !!record;
  }
}

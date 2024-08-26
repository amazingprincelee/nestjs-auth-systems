// src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { debug } from 'console';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
 

  constructor(private configService: ConfigService) {
    // Configure the transporter with environment variables
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      debug: true,
      logger: true
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `"No Reply" <${this.configService.get<string>('EMAIL_USERNAME')}>`,
      to,
      subject,
      text,
    });
  }
}

// src/twofa/dto/send-email.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}

// src/twofa/twofa.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { TwoFAService } from './providers/twofa.service';

@Controller('twofa')
export class TwoFAController {
  constructor(private readonly twoFAService: TwoFAService) {}

  @Post('verify')
  async verify(@Body() sendEmailDto: SendEmailDto) {
    const { email, token } = sendEmailDto;
    const isValid = await this.twoFAService.verifyToken(email, token);
    return { isValid };
  }
}

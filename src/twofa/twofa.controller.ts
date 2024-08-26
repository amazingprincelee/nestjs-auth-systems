// src/twofa/twofa.controller.ts
import { Controller, Post, Body, Patch, NotFoundException, BadRequestException } from '@nestjs/common';
import { TwoFAService } from './providers/twofa.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('twofa')
export class TwoFAController {
  constructor(
    private readonly twoFAService: TwoFAService,
  ) {}

  @Post('send')
  async sendToken(@Body('email') email: string) {
    return await this.twoFAService.sendToken(email);
  }

  @Post('enable')
  async enableTwoFA(@Body() sendEmailDto: SendEmailDto) {
      return await this.twoFAService.enable(sendEmailDto);
  }

  @Patch('disable')
  async disable2FA(@Body('email') email: string) {
      return await this.twoFAService.disable(email);
  }
}

import { Module } from '@nestjs/common';
import { TwofaVerificationController } from './twofa-verification.controller';
import { TwofaVerificationService } from './providers/twofa-verification.service';

@Module({
  controllers: [TwofaVerificationController],
  providers: [TwofaVerificationService]
})
export class TwofaVerificationModule {}

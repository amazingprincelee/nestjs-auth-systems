import { Module } from '@nestjs/common';
import { TwoFAService } from './providers/twofa.service';
import { UserModule } from 'src/user/user.module';
import { TwoFAController } from './twofa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFa } from './twofa.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([TwoFa]), EmailModule],
  controllers: [TwoFAController],
  providers: [TwoFAService],
  exports: [TwoFAService, TypeOrmModule],
})
export class TwofaModule {}

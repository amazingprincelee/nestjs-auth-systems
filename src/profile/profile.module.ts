import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './providers/profile.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UserModule]
})
export class ProfileModule {}

import { Module } from '@nestjs/common';
import { SocialAuthService } from './social-auth.service';
import { SocialAuthController } from './social-auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FacebookAuthStrategy } from './providers/facebook.strategy';
import { GoogleAuthStrategy } from './providers/google.strategy';
import { LinkedInAuthStrategy } from './providers/linkedin.strategy';
import { TwitterAuthStrategy } from './providers/twitter.strategy';
import { UserService } from 'src/user/providers/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';


@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    SocialAuthService,
    FacebookAuthStrategy,
    TwitterAuthStrategy,
    LinkedInAuthStrategy,
    GoogleAuthStrategy,

  ],
  controllers: [SocialAuthController]
})
export class SocialAuthModule {}

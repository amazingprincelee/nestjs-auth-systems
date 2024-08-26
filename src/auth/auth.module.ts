import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './provider/auth.service';
import { TwofaModule } from 'src/twofa/twofa.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './provider/jwt-strategy';
import { SocialAuthService } from 'src/social-auth/social-auth.service';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule
    UserModule,
    TwofaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SocialAuthService],
})
export class AuthModule {}

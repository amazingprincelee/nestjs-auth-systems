// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { TwoFa } from './twofa/twofa.entity';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { SocialAuthModule } from './social-auth/social-auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { EmailModule } from './email/email.module';
import { GoogleAuthStrategy } from './social-auth/providers/google.strategy';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';
import { PassportModule } from '@nestjs/passport';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    EmailModule,
    UserModule,
    AuthModule,
    SocialAuthModule,
    SocialAuthModule,
    EmailModule,
    JwtModule,
    ProfileModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, TwoFa], // Explicitly add entities here
        autoLoadEntities: true, // Keep this for future entities
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ChatGateway,
    GoogleAuthStrategy,
    AuthModule,
  ],
})
export class AppModule {}

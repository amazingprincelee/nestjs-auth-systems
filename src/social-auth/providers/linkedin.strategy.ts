import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedInAuthStrategy extends PassportStrategy(LinkedInStrategy, 'linkedin') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    // Handle the LinkedIn profile and return the user
    done(null, profile);
  }
}

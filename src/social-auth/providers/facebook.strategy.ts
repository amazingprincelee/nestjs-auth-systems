import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { SocialAuthService } from '../social-auth.service';


@Injectable()
export class FacebookAuthStrategy extends PassportStrategy(FacebookStrategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private socialAuthService: SocialAuthService, // Inject SocialAuthService
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const thirdPartyId = profile.id;
    const provider = 'facebook';

    // Delegate to the SocialAuthService to handle user logic
    const user = await this.socialAuthService.validateOAuthLogin(thirdPartyId, provider, profile);
    done(null, user);
  }
}

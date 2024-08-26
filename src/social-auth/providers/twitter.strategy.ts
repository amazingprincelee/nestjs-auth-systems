import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { ConfigService } from '@nestjs/config';
import { SocialAuthService } from '../social-auth.service';


@Injectable()
export class TwitterAuthStrategy extends PassportStrategy(TwitterStrategy, 'twitter') {
  constructor(
    private configService: ConfigService,
    private socialAuthService: SocialAuthService, // Inject SocialAuthService
  ) {
    super({
      consumerKey: configService.get<string>('TWITTER_CONSUMER_KEY'),
      consumerSecret: configService.get<string>('TWITTER_CONSUMER_SECRET'),
      callbackURL: configService.get<string>('TWITTER_CALLBACK_URL'),
    });
  }

  async validate(token: string, tokenSecret: string, profile: any, done: Function) {
    const thirdPartyId = profile.id;
    const provider = 'twitter';

    // Delegate to the SocialAuthService to handle user logic
    const user = await this.socialAuthService.validateOAuthLogin(thirdPartyId, provider, profile);
    done(null, user);
  }
}

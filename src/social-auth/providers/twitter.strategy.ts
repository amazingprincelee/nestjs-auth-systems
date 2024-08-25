import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterAuthStrategy extends PassportStrategy(TwitterStrategy, 'twitter') {
  constructor(private configService: ConfigService) {
    super({
      consumerKey: configService.get<string>('TWITTER_CONSUMER_KEY'),
      consumerSecret: configService.get<string>('TWITTER_CONSUMER_SECRET'),
      callbackURL: configService.get<string>('TWITTER_CALLBACK_URL'),
    });
  }

  async validate(token: string, tokenSecret: string, profile: any, done: Function) {
    // Handle the Twitter profile and return the user
    done(null, profile);
  }
}

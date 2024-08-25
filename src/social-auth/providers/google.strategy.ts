import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/providers/user.service';


@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(GoogleStrategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userService: UserService  // Inject your user service
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    // Extract the necessary fields from the profile
    const thirdPartyId = profile.id; // Google's unique user ID
    const provider = 'google'; // The OAuth provider
  
    // You can add more logic here if necessary
    done(null, { thirdPartyId, provider, profile });
  }
  
}

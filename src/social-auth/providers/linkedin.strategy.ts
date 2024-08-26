import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/providers/user.service';


@Injectable()
export class LinkedInAuthStrategy extends PassportStrategy(LinkedInStrategy, 'linkedin') {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const thirdPartyId = profile.id;
    const provider = 'linkedin';
    const user = await this.userService.findOrCreate(thirdPartyId, provider, profile);
    done(null, user);
  }
}

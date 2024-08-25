import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/providers/user.service';


@Injectable()
export class SocialAuthService {
  constructor(private readonly userService: UserService) {}

  async validateOAuthLogin(thirdPartyId: string, provider: string, profile: any): Promise<any> {
    return this.userService.findOrCreate(thirdPartyId, provider, profile);
  }
  
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class ProfileService {
  getAuthenticatedUser(user: User) {
    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found.');
    }
    
    return {
      message: 'Welcome back!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

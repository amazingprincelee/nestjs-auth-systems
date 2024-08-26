import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class ProfileService {
  /**
   * Retrieves the authenticated user's profile information.
   * Throws an UnauthorizedException if the user is not found.
   * 
   * @param user - The authenticated user entity
   * @returns An object containing a welcome message and the user's profile data
   * @throws UnauthorizedException if the user is not found or token is invalid
   */
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

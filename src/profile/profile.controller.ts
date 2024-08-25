import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/provider/jwt-authguard';
import { User } from 'src/user/user.entity'; 
import { ProfileService } from './providers/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {} // Inject ProfileService

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<any> {
    const user: User = req.user; 
    return this.profileService.getAuthenticatedUser(user); // Use ProfileService
  }
}

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/provider/jwt-authguard';
import { User } from 'src/user/user.entity';
import { ProfileService } from './providers/profile.service';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  @ApiBearerAuth() // Indicates that this endpoint requires a bearer token for authentication
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile',
    schema: {
      example: {
        id: 'string',
        username: 'string',
        email: 'string',
        // Add more fields as per your User entity
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req): Promise<any> {
    const user: User = req.user; 
    return this.profileService.getAuthenticatedUser(user);
  }
}

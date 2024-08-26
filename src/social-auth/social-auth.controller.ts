import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Social Auth System Module')
export class SocialAuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiates Google login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google for authentication' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async googleLogin(@Req() req) {
    // google Oauth 
  }

  @Get('google/user')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handles Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async googleAuthCallback(@Req() req) {
    // Handle the OAuth login 
    return { message: 'Successfully Authenticated' };
  }
}

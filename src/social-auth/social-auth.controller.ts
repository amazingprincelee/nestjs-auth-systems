import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class SocialAuthController {
  [x: string]: any;
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Req() req) {
    // Initiates the Facebook login
  }

  @Get('facebook/user')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req) {
    return req.user;
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin(@Req() req) {
    // Initiates the Twitter login
  }

  @Get('twitter/user')
  @UseGuards(AuthGuard('twitter'))
  async twitterCallback(@Req() req) {
    return req.user;
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin(@Req() req) {
    // Initiates the LinkedIn login
  }

  @Get('linkedin/user')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinCallback(@Req() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req) {
    // Initiates the Google login
  }

  @Get('google/user')
@UseGuards(AuthGuard('google'))
async googleAuthCallback() {
  // Handle the OAuth login here
  return {message: 'Successfully Authenticated'}
}

  
}

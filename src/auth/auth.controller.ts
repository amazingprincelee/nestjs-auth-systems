import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './provider/auth.service';
import { TwoFAService } from 'src/twofa/providers/twofa.service';
import { CreateUserDto } from 'src/user/dtos/create.user.dto';
import { LoginDto } from 'src/user/dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('Users authentication system.')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFAService: TwoFAService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    if (createUserDto.isTwoFactorEnabled) {
      await this.twoFAService.createTwoFAToken(user);
    }
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
   return this.authService.login(loginDto)
  }

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  
  }
  
}

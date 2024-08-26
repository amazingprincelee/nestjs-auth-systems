import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Indicates whether two-factor authentication is enabled for the user',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled?: boolean;
}

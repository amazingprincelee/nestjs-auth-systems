// src/user/dto/create-user.dto.ts
import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled?: boolean;
}

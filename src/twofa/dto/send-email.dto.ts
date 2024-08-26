import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    description: 'The email address to which the token will be sent',
    example: 'user@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The token sent to the user for email verification or two-factor authentication',
    example: 'abc123token',
  })
  @IsString()
  token: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'aarav@studio2.in' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'studio2' })
  @IsString()
  @MinLength(6)
  password: string;
}

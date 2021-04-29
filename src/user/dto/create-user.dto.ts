import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @ApiProperty({ type: String, description: '유저 이메일' })
  email!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'OAuth 소셜 종류', required: false })
  vendor?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '유저 비밀번호', required: false })
  password?: string;

  @IsString()
  @ApiProperty({ type: String, description: '유저 이름' })
  name!: string;
}

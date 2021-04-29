import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LocalLoginDTO {
  @IsEmail()
  @ApiProperty({ type: String, description: '유저 이메일' })
  email!: string;

  @IsString()
  @ApiProperty({ type: String, description: '유저 비밀번호' })
  password!: string;
}

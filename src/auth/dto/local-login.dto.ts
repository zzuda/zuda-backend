import { IsEmail, IsString } from 'class-validator';

export class LocalLoginDTO {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

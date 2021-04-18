import { IsEmail, IsString } from 'class-validator';

export class LocalRegisterDTO {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  name!: string;
}

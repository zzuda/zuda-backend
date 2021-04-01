import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDTO {
  @IsUUID()
  uuid!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  name!: string;
}

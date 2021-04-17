import { Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { IToken } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async generateToken(@Body() uuid: string): Promise<IToken> {
    const result = await this.authService.generateToken(uuid);
    return result;
  }
}

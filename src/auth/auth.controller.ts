import { Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async register(): Promise<void> {}

  @Post()
  async login(): Promise<void> {}

  @Delete()
  async logout(): Promise<void> {}
}

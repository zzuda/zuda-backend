import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async register(): Promise<void> {
    // TODO: Create user data and jwt
  }

  async login(): Promise<void> {
    // TODO: Create JWT and validate jwt
  }

  async logout(): Promise<void> {
    // TOOD: Delete access token and refresh token
  }
}

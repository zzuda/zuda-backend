import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IToken } from 'src/types';
import { AuthError } from '../shared/errors/auth.error';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  generateToken(uuid: string): IToken {
    const token = this.jwtService.sign(
      {
        uuid
      },
      {
        secret: this.configService.get('JWT_SECRET_KEY', 'Default'),
        expiresIn: `${this.configService.get('JWT_SECRET_EXPIRE_TIME', 'Default')}s`
      }
    );
    return {
      TOKEN: token
    };
  }

  validateToken(token: string): boolean {
    const valid = this.jwtService.verify(token, this.configService.get('JWT_SECRET_KEY'));
    if (!valid) {
      throw new NotFoundException(AuthError.INVALID_TOKEN);
    }
    return true;
  }

  refreshToken(uuid: string): IToken {
    const refreshToken = this.jwtService.sign(
      {
        uuid
      },
      {
        secret: this.configService.get('JWT_REFRESH_KEY', 'Default'),
        expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRE_TIME', 'Default')}s`
      }
    );

    return {
      REFRESH_TOKEN: refreshToken
    };
  }
}

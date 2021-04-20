import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { JwtPayload, RefreshTokenReturn, TokenReturn } from 'src/types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  generateToken(uuid: string): TokenReturn {
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

  validateToken(token: string, isRefreshToken?: boolean): JwtPayload | undefined {
    const secret = isRefreshToken
      ? this.configService.get('JWT_REFRESH_KEY', 'Default')
      : this.configService.get('JWT_SECRET_KEY', 'Default');

    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret
      });
    } catch (e) {
      return undefined;
    }
  }

  async validateLocalLogin(email: string, password: string): Promise<boolean> {
    const isExists = await this.userService.existsUserByEmail(email);

    if (!isExists) return false;

    const { password: userPassword } = await this.userService.findOneByEmail(email);

    if (!userPassword) return false;

    const compared = await bcrypt.compare(password, userPassword);

    if (!compared) return false;

    return true;
  }

  refreshToken(uuid: string): RefreshTokenReturn {
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

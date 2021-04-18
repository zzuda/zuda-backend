import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthError } from 'src/shared/errors/auth.error';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY', '')
    });
  }

  async validate(payload: { uuid: string }): Promise<User | undefined> {
    try {
      const { uuid } = payload;
      const user = await this.userService.findOneByUUID(uuid || '');
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException(AuthError.PERMISSION);
      }
    }

    return undefined;
  }
}

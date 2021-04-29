import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';

export const afterSuccessOAuthController = (
  res: Response,
  user: User,
  authService: AuthService,
  configService: ConfigService
): { user: User; token: string } => {
  const refreshToken = authService.refreshToken(user.uuid).REFRESH_TOKEN;

  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    secure: configService.get('NODE_ENV', 'production') === 'production',
    maxAge: configService.get('JWT_REFRESH_EXPIRE_TIME', 604800)
  });

  return {
    user,
    token: authService.generateToken(user.uuid).TOKEN
  };
};

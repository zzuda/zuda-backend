import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { AuthError } from 'src/shared/errors/auth.error';
import { AuthReturn } from 'src/types';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalLoginDTO } from './dto/local-login.dto';
import { LocalRegisterDTO } from './dto/local-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Post('/register')
  async localRegister(@Body() registerDTO: LocalRegisterDTO): Promise<User> {
    const registeredUser = await this.userService.create(registerDTO);
    registeredUser.password = '';
    return registeredUser;
  }

  @Post('/login')
  async localLogin(
    @Body() loginDTO: LocalLoginDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthReturn> {
    const { email, password } = loginDTO;
    const validation = await this.authService.validateLocalLogin(email, password);

    if (!validation) throw new NotFoundException(AuthError.EMAIL_OR_PASSWORD_ERROR);

    const user = await this.userService.findOneByEmail(email);
    user.password = '';

    const refreshToken = this.authService.refreshToken(user.uuid).REFRESH_TOKEN;
    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV', 'production') === 'production',
      maxAge: this.configService.get('JWT_REFRESH_EXPIRE_TIME', 604800)
    });

    return {
      user,
      token: this.authService.generateToken(user.uuid).TOKEN
    };
  }

  @Get('/naver')
  @UseGuards(AuthGuard('naver'))
  naverLogin(): boolean {
    return true;
  }

  @Get('/naver/c')
  @UseGuards(AuthGuard('naver'))
  naverLoginCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): AuthReturn {
    const user = req.user as User;
    user.password = '';
    const refreshToken = this.authService.refreshToken(user.uuid).REFRESH_TOKEN;

    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV', 'production') === 'production',
      maxAge: this.configService.get('JWT_REFRESH_EXPIRE_TIME', 604800)
    });

    return {
      user,
      token: this.authService.generateToken(user.uuid).TOKEN
    };
  }
}

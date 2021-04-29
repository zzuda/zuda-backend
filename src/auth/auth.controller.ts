import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { AuthError } from 'src/shared/errors/auth.error';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { AuthReturn } from 'src/types';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { afterSuccessOAuthController } from './auth.util';
import { LocalLoginDTO } from './dto/local-login.dto';
import { LocalRegisterDTO } from './dto/local-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  get(@Req() req: Request): User {
    return req.user as User;
  }

  @Post('/register')
  @ApiOkResponse()
  @ApiConflictResponse()
  @ApiBody({ type: LocalRegisterDTO })
  async localRegister(@Body() registerDTO: LocalRegisterDTO): Promise<User> {
    const registeredUser = await this.userService.create(registerDTO);
    registeredUser.password = '';
    return registeredUser;
  }

  @Post('/login')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBody({ type: LocalLoginDTO })
  async localLogin(
    @Body() loginDTO: LocalLoginDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthReturn> {
    const { email, password } = loginDTO;
    const validation = await this.authService.validateLocalLogin(email, password);

    if (!validation) throw new NotFoundException(AuthError.EMAIL_OR_PASSWORD_ERROR);

    const user = await this.userService.findOneByEmail(email);
    user.password = '';

    return afterSuccessOAuthController(res, user, this.authService, this.configService);
  }

  @Get('/naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOkResponse()
  naverLogin(): boolean {
    return true;
  }

  @Get('/naver/c')
  @UseGuards(AuthGuard('naver'))
  @ApiOkResponse()
  naverLoginCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): AuthReturn {
    const user = req.user as User;
    user.password = '';
    return afterSuccessOAuthController(res, user, this.authService, this.configService);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  @ApiOkResponse()
  googleLogin(): boolean {
    return true;
  }

  @Get('/google/c')
  @UseGuards(AuthGuard('google'))
  @ApiOkResponse()
  googleLoginCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): AuthReturn {
    const user = req.user as User;
    user.password = '';
    return afterSuccessOAuthController(res, user, this.authService, this.configService);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOkResponse()
  facebookLogin(): boolean {
    return true;
  }

  @Get('/facebook/c')
  @UseGuards(AuthGuard('facebook'))
  @ApiOkResponse()
  facebookLoginCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): AuthReturn {
    const user = req.user as User;
    user.password = '';
    return afterSuccessOAuthController(res, user, this.authService, this.configService);
  }

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOkResponse()
  kakaoLogin(): boolean {
    return true;
  }

  @Get('/kakao/c')
  @UseGuards(AuthGuard('kakao'))
  @ApiOkResponse()
  kakaoLoginCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response): AuthReturn {
    const user = req.user as User;
    user.password = '';
    return afterSuccessOAuthController(res, user, this.authService, this.configService);
  }

  @Post('/token')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  getToken(@Req() req: Request): string {
    const refreshToken = req.cookies.refreshtoken;

    const decode = this.authService.validateToken(refreshToken, true);
    if (!decode) throw new UnauthorizedException(AuthError.PERMISSION);

    const token = this.authService.generateToken(decode.uuid).TOKEN;
    return token;
  }

  @Delete('/logout')
  @ApiOkResponse()
  logout(@Res() res: Response): boolean {
    res.clearCookie('refreshtoken');
    return true;
  }
}

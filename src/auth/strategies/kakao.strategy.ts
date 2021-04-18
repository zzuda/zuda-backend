import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { UserError } from 'src/shared/errors/user.error';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID', ''),
      clientSecret: configService.get<string>('KAKAO_SECRET', ''),
      callbackURL: configService.get<string>('KAKAO_CALLBACK', '')
    });
  }

  async validate(_: string, __: string, profile: Profile): Promise<User> {
    // eslint-disable-next-line no-underscore-dangle
    const { email, profile: profileObj } = profile._json.kakao_account;
    const { nickname } = profileObj;

    const exists = await this.userService.existsUserByEmail(email);

    if (exists) {
      const user = await this.userService.findOneByEmail(email);
      if (user.vendor !== 'kakao') {
        throw new ConflictException(UserError.USER_ALREADY_EXISTS);
      }
      return user;
    }

    const dto = new CreateUserDTO();
    dto.email = email;
    dto.name = nickname;
    dto.vendor = 'kakao';

    const createdUser = await this.userService.create(dto);

    return createdUser;
  }
}

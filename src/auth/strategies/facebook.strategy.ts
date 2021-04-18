import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID', ''),
      clientSecret: configService.get<string>('FACEBOOK_SECRET', ''),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK', ''),
      scope: ['email', 'public_profile'],
      profileFields: ['displayName', 'email']
    });
  }

  async validate(_: string, __: string, profile: any): Promise<any> {
    // eslint-disable-next-line no-underscore-dangle
    const { email, name } = profile._json;

    const exists = await this.userService.existsUserByEmail(email);

    if (exists) {
      const user = await this.userService.findOneByEmail(email);
      return user;
    }

    const dto = new CreateUserDTO();
    dto.email = email;
    dto.name = name;
    dto.vendor = 'facebook';

    const createdUser = await this.userService.create(dto);

    return createdUser;
  }
}

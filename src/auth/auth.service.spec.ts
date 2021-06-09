import { Test, TestingModule } from '@nestjs/testing';
import faker from 'faker';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { createUserMock } from '../utils/test.util';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  softRemove: jest.fn()
});

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'asdfghjkl'
        })
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET_EXPIRE_TIME':
                  return '5m';
                case 'JWT_REFRESH_EXPIRE_TIME':
                  return '10m';
                default:
                  return null;
              }
            })
          }
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository()
        },
        AuthService
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  describe('Generate Token', () => {
    it('새로운 AccessToken을 만든다.', () => {
      const uuidMock = faker.datatype.uuid();

      const result = authService.generateToken(uuidMock);
      expect(result).toStrictEqual({
        TOKEN: expect.any(String)
      });
    });

    it('새로운 RefreshToken을 만든다.', () => {
      const uuidMock = faker.datatype.uuid();

      const result = authService.refreshToken(uuidMock);
      expect(result).toStrictEqual({
        REFRESH_TOKEN: expect.any(String)
      });
    });
  });

  describe('Validate Token', () => {
    it('AccessToken을 검증한다.', () => {
      const uuidMock = faker.datatype.uuid();

      const expectResult = {
        iat: 1,
        exp: 1,
        uuid: uuidMock
      };

      const verifySpy = jest.spyOn(jwtService, 'verify').mockReturnValue(expectResult);

      const jwt = authService.generateToken(uuidMock);
      const result = authService.validateToken(jwt.TOKEN);

      expect(verifySpy).toBeCalled();
      expect(result).toBe(expectResult);
    });
  });

  it('AccessToken이 잘못 되었다.', () => {
    const jwt = 'invalid.token';
    const result = authService.validateToken(jwt);

    expect(result).toBe(undefined);
  });

  it('이메일과 비밀번호를 이용하여 계정을 검증한다.', async () => {
    const email = faker.internet.email();
    const password = faker.datatype.string();

    const existsSpy = jest.spyOn(userService, 'existsUserByEmail').mockResolvedValue(true);
    const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(
      createUserMock(
        { email },
        {
          password
        }
      )
    );
    const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await authService.validateLocalLogin(email, password);

    expect(existsSpy).toHaveBeenCalledWith(email);
    expect(findOneSpy).toHaveBeenCalledWith(email);
    expect(compareSpy).toBeCalled();
    expect(result).toBeTruthy();
  });

  it('존재하지 않는 유저가 계정 검증을 시도한다.', async () => {
    const email = faker.internet.email();
    const password = faker.datatype.string();

    const existsSpy = jest.spyOn(userService, 'existsUserByEmail').mockResolvedValue(false);

    const result = await authService.validateLocalLogin(email, password);

    expect(existsSpy).toHaveBeenCalledWith(email);
    expect(result).toBeFalsy();
  });

  it('틀린 비밀번호로 계정 검증을 시도한다.', async () => {
    const email = faker.internet.email();
    const password = faker.datatype.string();

    const existsSpy = jest.spyOn(userService, 'existsUserByEmail').mockResolvedValue(true);
    const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(
      createUserMock(
        { email },
        {
          password
        }
      )
    );
    const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const result = await authService.validateLocalLogin(email, password);

    expect(existsSpy).toHaveBeenCalledWith(email);
    expect(findOneSpy).toHaveBeenCalledWith(email);
    expect(compareSpy).toBeCalled();
    expect(result).toBeFalsy();
  });
});

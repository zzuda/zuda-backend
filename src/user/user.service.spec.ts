import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { classToPlain } from 'class-transformer';
import faker from 'faker';
import { UserService } from './user.service';
import { UserError } from '../shared/errors/user.error';
import { User } from './user.entity';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
});

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository()
        },
        ConfigService,
        UserService
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('Create User', () => {
    it('소셜로그인을 이용하여 새로운 유저를 생성한다.', async () => {
      const createUserDto = {
        email: faker.internet.email(),
        vendor: 'naver',
        name: faker.name.findName()
      };

      const result = {
        ...createUserDto,
        uuid: expect.any(String),
        password: undefined
      };

      const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockImplementation(() => {
        throw new NotFoundException(UserError.USER_NOT_FOUND);
      });

      const user = await userService.create(createUserDto);

      expect(findOneSpy).toHaveBeenCalledWith(createUserDto.email);
      expect(user.vendor).not.toBe(undefined);
      expect(user.password).toBe(undefined);
      expect(classToPlain(user)).toStrictEqual(result);
    });

    it('비밀번호를 이용하여 새로운 유저를 생성한다.', async () => {
      const createUserDto = {
        email: faker.internet.email(),
        password: faker.random.word(),
        name: faker.name.findName()
      };

      const result = {
        ...createUserDto,
        uuid: expect.any(String),
        password: expect.any(String),
        vendor: undefined
      };

      const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockImplementation(() => {
        throw new NotFoundException(UserError.USER_NOT_FOUND);
      });

      const user = await userService.create(createUserDto);

      expect(findOneSpy).toHaveBeenCalledWith(createUserDto.email);
      expect(user.password).not.toBe(undefined);
      expect(user.vendor).toBe(undefined);
      expect(classToPlain(user)).toStrictEqual(result);
    });
  });
});

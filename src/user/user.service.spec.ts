import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { classToPlain } from 'class-transformer';
import faker from 'faker';
import { Repository } from 'typeorm';
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
  let userRepository: Repository<User>;

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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
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

      const user = await userService.create(createUserDto);

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

      const user = await userService.create(createUserDto);

      expect(user.password).not.toBe(undefined);
      expect(user.vendor).toBe(undefined);
      expect(classToPlain(user)).toStrictEqual(result);
    });

    it('이미 존재하는 유저가 계정을 생성한다.', async () => {
      const createUserDto = {
        email: faker.internet.email(),
        vendor: 'naver',
        name: faker.name.findName()
      };

      const user = new User();
      user.email = createUserDto.email;
      user.vendor = createUserDto.vendor;
      user.name = createUserDto.name;
      user.uuid = expect.any(String);
      user.password = undefined;

      const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);

      try {
        await userService.create(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe(UserError.USER_ALREADY_EXISTS.message);
      }

      expect(findOneSpy).toHaveBeenCalledWith(createUserDto.email);
    });
  });

  describe('Exists User', () => {
    it('UUID로 유저가 존재하는지 확인한다.', async () => {
      const uuidMock = faker.datatype.uuid();

      const userMock = new User();
      userMock.uuid = uuidMock;
      userMock.email = faker.internet.email();
      userMock.name = faker.name.findName();
      userMock.vendor = 'naver';
      userMock.password = undefined;

      const findOneSpy = jest.spyOn(userService, 'findOneByUUID').mockResolvedValue(userMock);
      const exists = await userService.existsUserByUUID(uuidMock);

      expect(findOneSpy).toHaveBeenCalledWith(uuidMock);
      expect(exists).toBeTruthy();
    });

    it('이메일로 유저가 존재하는지 확인한다.', async () => {
      const emailMock = faker.internet.email();

      const userMock = new User();
      userMock.uuid = faker.datatype.uuid();
      userMock.email = emailMock;
      userMock.name = faker.name.findName();
      userMock.vendor = 'google';
      userMock.password = undefined;

      const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(userMock);
      const exists = await userService.existsUserByEmail(emailMock);

      expect(findOneSpy).toHaveBeenCalledWith(emailMock);
      expect(exists).toBeTruthy();
    });
  });

  describe('Find User', () => {
    it('저장된 모든 유저를 가져온다.', async () => {
      const createUserMock = () => {
        const userMock = new User();
        userMock.uuid = faker.datatype.uuid();
        userMock.email = faker.internet.email();
        userMock.name = faker.name.findName();
        userMock.vendor = 'google';
        userMock.password = undefined;
        return userMock;
      };

      const dataMock = [createUserMock(), createUserMock(), createUserMock()];
      const findAllSpy = jest.spyOn(userRepository, 'find').mockResolvedValue(dataMock);

      const result = await userService.findAll();

      expect(findAllSpy).toBeTruthy();
      expect(result).toHaveLength(3);
    });

    it('UUID로 유저 정보를 가져온다.', async () => {
      const uuidMock = faker.datatype.uuid();

      const userMock = new User();
      userMock.uuid = uuidMock;
      userMock.email = faker.internet.email();
      userMock.name = faker.name.findName();
      userMock.vendor = 'naver';
      userMock.password = undefined;

      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);
      const user = await userService.findOneByUUID(uuidMock);

      expect(findOneSpy).toHaveBeenCalledWith({
        uuid: uuidMock
      });
      expect(user).toBe(userMock);
    });

    it('이메일로 유저 정보를 가져온다.', async () => {
      const emailMock = faker.internet.email();

      const userMock = new User();
      userMock.uuid = faker.datatype.uuid();
      userMock.email = emailMock;
      userMock.name = faker.name.findName();
      userMock.vendor = 'naver';
      userMock.password = undefined;

      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);
      const user = await userService.findOneByEmail(emailMock);

      expect(findOneSpy).toHaveBeenCalledWith({
        email: emailMock
      });
      expect(user).toBe(userMock);
    });
  });
});

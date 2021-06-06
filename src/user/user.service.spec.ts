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
import { createUserMock } from '../utils/test.util';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  softRemove: jest.fn()
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

    it('유저가 이미 존재하면 오류를 반환한다.', async () => {
      const createUserDto = {
        email: faker.internet.email(),
        vendor: 'naver',
        name: faker.name.findName()
      };

      const userMock = createUserMock(
        {
          ...createUserDto,
          uuid: expect.any(String)
        },
        {
          vendor: createUserDto.vendor
        }
      );

      const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(userMock);

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

      const userMock = createUserMock(
        {
          uuid: uuidMock
        },
        { vendor: 'naver' }
      );

      const findOneSpy = jest.spyOn(userService, 'findOneByUUID').mockResolvedValue(userMock);
      const exists = await userService.existsUserByUUID(uuidMock);

      expect(findOneSpy).toHaveBeenCalledWith(uuidMock);
      expect(exists).toBeTruthy();
    });

    it('이메일로 유저가 존재하는지 확인한다.', async () => {
      const emailMock = faker.internet.email();

      const userMock = createUserMock(
        {
          email: emailMock
        },
        { vendor: 'naver' }
      );

      const findOneSpy = jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(userMock);
      const exists = await userService.existsUserByEmail(emailMock);

      expect(findOneSpy).toHaveBeenCalledWith(emailMock);
      expect(exists).toBeTruthy();
    });
  });

  describe('Find User', () => {
    it('저장된 모든 유저를 가져온다.', async () => {
      const dataMock = [
        createUserMock({}, { vendor: 'naver' }),
        createUserMock({}, { vendor: 'naver' }),
        createUserMock({}, { vendor: 'naver' })
      ];
      const findAllSpy = jest.spyOn(userRepository, 'find').mockResolvedValue(dataMock);

      const result = await userService.findAll();

      expect(findAllSpy).toBeTruthy();
      expect(result).toHaveLength(3);
    });

    it('UUID로 유저 정보를 가져온다.', async () => {
      const uuidMock = faker.datatype.uuid();

      const userMock = createUserMock(
        {
          uuid: uuidMock
        },
        { vendor: 'naver' }
      );

      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);
      const user = await userService.findOneByUUID(uuidMock);

      expect(findOneSpy).toHaveBeenCalledWith({
        uuid: uuidMock
      });
      expect(user).toBe(userMock);
    });

    it('이메일로 유저 정보를 가져온다.', async () => {
      const emailMock = faker.internet.email();

      const userMock = createUserMock(
        {
          email: emailMock
        },
        { vendor: 'naver' }
      );

      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);
      const user = await userService.findOneByEmail(emailMock);

      expect(findOneSpy).toHaveBeenCalledWith({
        email: emailMock
      });
      expect(user).toBe(userMock);
    });
  });

  describe('Update User', () => {
    it('유저 정보를 수정한다.', async () => {
      const uuidMock = faker.datatype.uuid();

      const olderUserMock = createUserMock(
        {
          uuid: uuidMock
        },
        { password: 'password' }
      );

      const updateUserDto = {
        password: 'newpassword',
        name: faker.name.findName()
      };

      const result = {
        ...olderUserMock,
        ...updateUserDto
      };

      const findOneSpy = jest.spyOn(userService, 'findOneByUUID').mockResolvedValue(olderUserMock);
      const updateSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(result);

      const user = await userService.update(uuidMock, updateUserDto);

      expect(findOneSpy).toHaveBeenCalledWith(uuidMock);
      expect(updateSpy).toHaveBeenCalledWith(result);
      expect(classToPlain(user)).toStrictEqual(result);
    });

    it('존재하지 않는 유저를 수정하면 오류를 반환한다.', async () => {
      const uuidMock = faker.datatype.uuid();

      const updateUserDto = {
        password: 'newpassword',
        name: faker.name.findName()
      };

      const findOneSpy = jest.spyOn(userService, 'findOneByUUID').mockImplementation(() => {
        throw new NotFoundException(UserError.USER_NOT_FOUND);
      });

      try {
        await userService.update(uuidMock, updateUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(UserError.USER_NOT_FOUND.message);
      }

      expect(findOneSpy).toHaveBeenCalledWith(uuidMock);
    });
  });

  describe('Delete User', () => {
    it('유저를 삭제한다.', async () => {
      const uuidMock = faker.datatype.uuid();

      const userMock = createUserMock(
        {
          uuid: uuidMock
        },
        { vendor: 'naver' }
      );

      const findOneSpy = jest.spyOn(userService, 'findOneByUUID').mockResolvedValue(userMock);

      const user = await userService.delete(uuidMock);

      expect(findOneSpy).toHaveBeenCalledWith(uuidMock);
      expect(user).toStrictEqual(userMock);
    });

    it('존재하지 않는 유저를 삭제하면 오류를 반환한다.', async () => {
      const uuidMock = faker.datatype.uuid();

      const findOneSpy = jest.spyOn(userService, 'findOneByUUID').mockImplementation(() => {
        throw new NotFoundException(UserError.USER_NOT_FOUND);
      });

      try {
        await userService.delete(uuidMock);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(UserError.USER_NOT_FOUND.message);
      }

      expect(findOneSpy).toHaveBeenCalledWith(uuidMock);
    });
  });
});

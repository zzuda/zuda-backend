import { Test, TestingModule } from '@nestjs/testing';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getModelToken } from '@nestjs/mongoose';
import faker from 'faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomService } from './room.service';
import { Room } from '../room.entity';
import { RoomMember } from '../room.schema';
import { WordService } from '../../word/word.service';
import { Word } from '../../word/word.entity';
import { RoomError } from '../../shared/errors/room.error';
import { createRoomMock, makeWordMock } from '../../utils/test.util';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  softRemove: jest.fn(),
  remove: jest.fn()
});

const wordRepository = () => ({
  findOne: jest.fn(() => makeWordMock())
});

const mockMongoose = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  exec: jest.fn()
});

describe('RoomSerivce', () => {
  let roomService: RoomService;
  let roomRepository: Repository<Room>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Word),
          useValue: wordRepository()
        },
        {
          provide: getRepositoryToken(Room),
          useValue: mockRepository()
        },
        {
          provide: getModelToken(RoomMember.name),
          useValue: mockMongoose()
        },
        WordService,
        RoomService
      ]
    }).compile();

    roomService = module.get<RoomService>(RoomService);
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
  });

  describe('Create Room', () => {
    it('새로운 방을 만든다.', async () => {
      const uuidMock = faker.datatype.uuid();
      const createRoomDto = {
        roomName: '한국사',
        owner: uuidMock,
        maxPeople: 3
      };
      const room = await roomService.create(createRoomDto);

      expect(classToPlain(room)).toStrictEqual({
        inviteCode: expect.any(String),
        ...createRoomDto
      });
    });

    it('이미 사용 중인 이름으로 방을 만든다.', async () => {
      const uuidMock = faker.datatype.uuid();
      const createRoomDto = {
        roomName: '이미쓰는이름',
        owner: uuidMock,
        maxPeople: 3
      };

      const existsSpy = jest.spyOn(roomService, 'existsRoomByName').mockResolvedValue(true);

      try {
        await roomService.create(createRoomDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe(RoomError.ROOM_NAME_USED.message);
      }

      expect(existsSpy).toBeCalledWith(createRoomDto.roomName);
    });
  });

  describe('Exists Room', () => {
    it('roomId로 방이 존재하는지 확인한다.', async () => {
      const mock = createRoomMock();

      const getRoomSpy = jest.spyOn(roomService, 'getRoom').mockResolvedValue(mock);

      const exists = await roomService.existsRoom(mock.roomId);

      expect(getRoomSpy).toBeCalledWith(mock.roomId);
      expect(exists).toBeTruthy();
    });

    it('roomId가 존재하지 않으면 false를 반환한다.', async () => {
      const idMock = faker.datatype.number();

      const getRoomSpy = jest.spyOn(roomService, 'getRoom').mockImplementation(() => {
        throw new NotFoundException(RoomError.ROOM_NOT_FOUND);
      });

      const exists = await roomService.existsRoom(idMock);

      expect(getRoomSpy).toBeCalledWith(idMock);
      expect(exists).toBeFalsy();
    });

    it('이름으로 방이 존재하는지 확인한다.', async () => {
      const mock = createRoomMock();

      const getRoomByNameSpy = jest.spyOn(roomService, 'getRoomByName').mockResolvedValue(mock);

      const exists = await roomService.existsRoomByName(mock.roomName);

      expect(getRoomByNameSpy).toBeCalledWith(mock.roomName);
      expect(exists).toBeTruthy();
    });

    it('방 이름이 존재하지 않으면 false를 반환한다.', async () => {
      const roomNameMock = faker.name.title();

      const getRoomSpy = jest.spyOn(roomService, 'getRoomByName').mockImplementation(() => {
        throw new NotFoundException(RoomError.ROOM_NOT_FOUND);
      });

      const exists = await roomService.existsRoomByName(roomNameMock);

      expect(getRoomSpy).toBeCalledWith(roomNameMock);
      expect(exists).toBeFalsy();
    });

    it('초대코드로 방이 존재하는지 확인한다.', async () => {
      const mock = createRoomMock();

      const getRoomByCodeSpy = jest.spyOn(roomService, 'getRoomByCode').mockResolvedValue(mock);

      const exists = await roomService.existsRoomByCode(mock.inviteCode);

      expect(getRoomByCodeSpy).toBeCalledWith(mock.inviteCode);
      expect(exists).toBeTruthy();
    });

    it('초대코드가 존재하지 않으면 false를 반환한다.', async () => {
      const wordMock = makeWordMock();

      const getRoomSpy = jest.spyOn(roomService, 'getRoomByCode').mockImplementation(() => {
        throw new NotFoundException(RoomError.ROOM_NOT_FOUND);
      });

      const exists = await roomService.existsRoomByCode(wordMock);

      expect(getRoomSpy).toBeCalledWith(wordMock);
      expect(exists).toBeFalsy();
    });
  });

  describe('Find Room', () => {
    it('모든 방을 가져온다.', async () => {
      const list = [createRoomMock(), createRoomMock(), createRoomMock(), createRoomMock()];

      const findAllSpy = jest.spyOn(roomRepository, 'find').mockResolvedValue(list);

      const result = await roomService.findAll();

      expect(findAllSpy).toBeCalled();
      expect(result).toHaveLength(list.length);
    });

    it('roomId로 방을 가져온다.', async () => {
      const roomMock = createRoomMock();

      const findOneSpy = jest.spyOn(roomRepository, 'findOne').mockResolvedValue(roomMock);

      const result = await roomService.getRoom(roomMock.roomId);

      expect(findOneSpy).toHaveBeenCalledWith(roomMock.roomId);
      expect(result).toBe(roomMock);
    });

    it('roomId가 존재하지 않으면 오류를 반환한다.', async () => {
      const roomMock = createRoomMock();

      const findOneSpy = jest.spyOn(roomRepository, 'findOne').mockImplementation(() => {
        throw new NotFoundException(RoomError.ROOM_NOT_FOUND);
      });

      try {
        await roomService.getRoom(roomMock.roomId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(RoomError.ROOM_NOT_FOUND.message);
      }

      expect(findOneSpy).toHaveBeenCalledWith(roomMock.roomId);
    });

    it('이름으로 방을 가져온다.', async () => {
      const roomMock = createRoomMock();

      const findOneSpy = jest.spyOn(roomRepository, 'findOne').mockResolvedValue(roomMock);

      const result = await roomService.getRoomByName(roomMock.roomName);

      expect(findOneSpy).toHaveBeenCalledWith({
        roomName: roomMock.roomName
      });
      expect(result).toBe(roomMock);
    });

    it('이름이 존재하지 않으면 오류를 반환한다.', async () => {
      const roomMock = createRoomMock();

      const findOneSpy = jest.spyOn(roomRepository, 'findOne').mockImplementation(() => {
        throw new NotFoundException(RoomError.ROOM_NOT_FOUND);
      });

      try {
        await roomService.getRoomByName(roomMock.roomName);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(RoomError.ROOM_NOT_FOUND.message);
      }

      expect(findOneSpy).toHaveBeenCalledWith({
        roomName: roomMock.roomName
      });
    });

    it('초대코드로 방을 가져온다.', async () => {
      const roomMock = createRoomMock();

      const findOneSpy = jest.spyOn(roomRepository, 'findOne').mockResolvedValue(roomMock);

      const result = await roomService.getRoomByCode(roomMock.inviteCode);

      expect(findOneSpy).toHaveBeenCalledWith({
        inviteCode: roomMock.inviteCode
      });
      expect(result).toBe(roomMock);
    });

    it('초대코드가 존재하지 않으면 오류를 반환한다.', async () => {
      const roomMock = createRoomMock();

      const findOneSpy = jest.spyOn(roomRepository, 'findOne').mockImplementation(() => {
        throw new NotFoundException(RoomError.ROOM_NOT_FOUND);
      });

      try {
        await roomService.getRoomByCode(roomMock.inviteCode);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(RoomError.ROOM_NOT_FOUND.message);
      }

      expect(findOneSpy).toHaveBeenCalledWith({
        inviteCode: roomMock.inviteCode
      });
    });
  });

  describe('Update Room', () => {
    it('방 정보를 수정한다.', async () => {
      const olderRoomMock = createRoomMock();

      const updateRoomDto = {
        roomName: '바뀐이름'
      };

      const expectResult = {
        ...olderRoomMock,
        ...updateRoomDto
      };

      const getSpy = jest.spyOn(roomService, 'getRoom').mockResolvedValue(olderRoomMock);
      const saveSpy = jest.spyOn(roomRepository, 'save').mockResolvedValue(expectResult);

      const result = await roomService.update(olderRoomMock.roomId, updateRoomDto);

      expect(getSpy).toHaveBeenCalledWith(olderRoomMock.roomId);
      expect(saveSpy).toHaveBeenCalledWith(expectResult);
      expect(classToPlain(result)).toStrictEqual(expectResult);
    });

    it('존재하지 않는 방 정보를 수정하면 오류를 반환한다.', async () => {
      const olderRoomMock = createRoomMock();

      const getSpy = jest.spyOn(roomService, 'getRoom').mockResolvedValue(olderRoomMock);

      try {
        await roomService.update(olderRoomMock.roomId, {
          roomName: '바뀐이름'
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(RoomError.ROOM_NOT_FOUND.message);
      }

      expect(getSpy).toHaveBeenCalledWith(olderRoomMock.roomId);
    });
  });

  describe('Update InviteCode of Room', () => {
    it('방 초대코드를 재발급한다.', async () => {
      const roomMock = createRoomMock();

      const expectResult = {
        ...roomMock,
        inviteCode: expect.any(String)
      };

      const getSpy = jest.spyOn(roomService, 'getRoom').mockResolvedValue(roomMock);
      const saveSpy = jest.spyOn(roomRepository, 'save').mockResolvedValue(expectResult);
      const result = await roomService.updateInviteCode(roomMock.roomId);

      expect(getSpy).toHaveBeenCalledWith(roomMock.roomId);
      expect(saveSpy).toHaveBeenCalledWith(expectResult);
      expect(result).toBe(expectResult);
    });

    it('존재하지 않는 방의 초대코드를 재발급하면 오류를 반환한다.', async () => {
      const roomMock = createRoomMock();
      const getSpy = jest.spyOn(roomService, 'getRoom').mockImplementation(() => {
        throw new NotFoundException(RoomError.ROOM_NOT_FOUND);
      });

      try {
        await roomService.updateInviteCode(roomMock.roomId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(RoomError.ROOM_NOT_FOUND.message);
      }

      expect(getSpy).toHaveBeenCalledWith(roomMock.roomId);
    });
  });

  describe('Delete Room', () => {
    it('방을 삭제한다.', async () => {
      const roomMock = createRoomMock();

      const getSpy = jest.spyOn(roomService, 'getRoom').mockResolvedValue(roomMock);
      const result = await roomService.delete(roomMock.roomId);

      expect(getSpy).toHaveBeenCalledWith(roomMock.roomId);
      expect(result).toStrictEqual(roomMock);
    });

    it('존재하지 않는 방을 삭제하면 오류를 반환한다.', async () => {
      const roomMock = createRoomMock();

      const getSpy = jest.spyOn(roomService, 'getRoom').mockResolvedValue(roomMock);

      try {
        await roomService.delete(roomMock.roomId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(RoomError.ROOM_NOT_FOUND.message);
      }

      expect(getSpy).toHaveBeenCalledWith(roomMock.roomId);
    });
  });
});

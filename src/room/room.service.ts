import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { RoomError } from 'src/shared/errors/room.error';
import { RoomInteractReturn } from 'src/types';
import { WordService } from 'src/word/word.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDTO } from './dto/create-room.dto';
import { Room } from './room.entity';
import { RoomMember, RoomMemberDocument } from './room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectModel(RoomMember.name) private readonly roomMemberModel: Model<RoomMemberDocument>,
    private readonly wordService: WordService
  ) {}

  async create(createRoomDto: CreateRoomDTO): Promise<Room> {
    const inviteCode = await this.wordService.makeRandomWord();

    const exists = await this.existsRoomByName(createRoomDto.roomName);
    if (exists) throw new ConflictException(RoomError.ROOM_NAME_USED);

    const room = new Room();
    room.roomName = createRoomDto.roomName;
    room.owner = createRoomDto.owner;
    room.maxPeople = createRoomDto.maxPeople;
    room.inviteCode = inviteCode;
    await this.roomRepository.save(room);

    await this.roomMemberModel.create({
      roomId: room.roomId,
      members: []
    });

    return room;
  }

  async findAll(): Promise<Room[]> {
    const result = await this.roomRepository.find();
    return result;
  }

  async getRoom(roomId: number): Promise<Room> {
    const room = await this.roomRepository.findOne(roomId);

    if (!room) throw new NotFoundException(RoomError.ROOM_NOT_FOUND);

    return room;
  }

  async getRoomByName(roomName: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      roomName
    });

    if (!room) throw new NotFoundException(RoomError.ROOM_NOT_FOUND);

    return room;
  }

  async getRoomByCode(inviteCode: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      inviteCode
    });

    if (!room) throw new NotFoundException(RoomError.ROOM_NOT_FOUND);

    return room;
  }

  async getRoomMember(roomId: number): Promise<RoomMemberDocument> {
    const roomMember = this.roomMemberModel.findOne({
      roomId
    });
    if (!roomMember) throw new NotFoundException(RoomError.ROOM_NOT_FOUND);

    return (roomMember as unknown) as RoomMemberDocument;
  }

  async existsRoom(roomId: number): Promise<boolean> {
    try {
      const room = await this.getRoom(roomId);
      if (room) return true;
    } catch (e) {
      if (e instanceof NotFoundException) {
        return false;
      }
    }

    return false;
  }

  async existsRoomByName(roomName: string): Promise<boolean> {
    try {
      const room = await this.getRoomByName(roomName);
      if (room) return true;
    } catch (e) {
      if (e instanceof NotFoundException) {
        return false;
      }
    }

    return false;
  }

  async existsRoomByCode(inviteCode: string): Promise<boolean> {
    try {
      const room = await this.getRoomByCode(inviteCode);
      if (room) return true;
    } catch (e) {
      if (e instanceof NotFoundException) {
        return false;
      }
    }

    return false;
  }

  async isRoomFull(roomId: number): Promise<boolean> {
    const { maxPeople } = await this.getRoom(roomId);
    const roomMember = await this.getRoomMember(roomId);
    const currentMember = roomMember.members.length;

    if (currentMember === maxPeople) return true;
    return false;
  }

  private generateGuestId(): string {
    return uuidv4();
  }

  async joinRoom(roomId: number, userId?: string): Promise<RoomInteractReturn> {
    const isFull = await this.isRoomFull(roomId);
    if (isFull) throw new WsException(RoomError.ROOM_IS_FULL);

    const guestUserId = userId || this.generateGuestId();
    const roomMember = await this.getRoomMember(roomId);

    if (roomMember.members.includes(guestUserId))
      throw new WsException(RoomError.GUEST_ALREADY_JOIN);

    roomMember.members.push(guestUserId);
    await roomMember.save();

    const room = await this.getRoom(roomId);

    return {
      guestId: guestUserId,
      roomInfo: room
    };
  }

  async quitRoom(roomId: number, userId: string): Promise<void> {
    const exists = this.existsRoom(roomId);

    if (!exists) throw new WsException(RoomError.ROOM_NOT_FOUND);

    const roomMember = await this.getRoomMember(roomId);

    if (!roomMember.members.includes(userId)) throw new WsException(RoomError.GUEST_NOT_FOUND);

    const guestIndex = roomMember.members.findIndex((i) => i === userId);

    roomMember.members.splice(guestIndex, 1);
    await roomMember.save();
  }
}

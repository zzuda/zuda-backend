import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { RoomError } from 'src/shared/errors/room.error';
import { WordService } from 'src/word/word.service';
import { Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { Room } from '../room.entity';
import { RoomMember, RoomMemberDocument } from '../room.schema';

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
}

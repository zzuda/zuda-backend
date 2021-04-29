import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { RoomError } from 'src/shared/errors/room.error';
import { WordService } from 'src/word/word.service';
import { Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { UpdateRoomDTO } from '../dto/update-room.dto';
import { Room } from '../room.entity';
import { RoomMember, RoomMemberDocument } from '../room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectModel(RoomMember.name) private readonly roomMemberModel: Model<RoomMemberDocument>,
    private readonly wordService: WordService
  ) {}

  private async makeInviteCodeNotConflict(maxTry?: number): Promise<string> {
    let inviteCode: string | undefined;

    // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unused-vars
    for await (const _ of new Array(maxTry || 3).fill('')) {
      inviteCode = await this.wordService.makeRandomWord();
      const roomByCode = await this.existsRoomByCode(inviteCode);

      if (!roomByCode) break;
    }

    if (inviteCode === undefined) {
      throw new InternalServerErrorException(RoomError.ROOM_FAIL_INVITECODE);
    }

    return inviteCode;
  }

  async create(createRoomDto: CreateRoomDTO): Promise<Room> {
    const exists = await this.existsRoomByName(createRoomDto.roomName);
    if (exists) throw new ConflictException(RoomError.ROOM_NAME_USED);

    const inviteCode = await this.makeInviteCodeNotConflict();

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

  async update(roomId: number, updateRoomDto: UpdateRoomDTO): Promise<Room> {
    const room = await this.getRoom(roomId);
    const result = await this.roomRepository.save({
      ...room,
      ...updateRoomDto
    });
    return result;
  }

  async updateInviteCode(roomId: number): Promise<Room> {
    const room = await this.getRoom(roomId);
    const newInviteCode = await this.makeInviteCodeNotConflict();
    const result = await this.roomRepository.save({
      ...room,
      inviteCode: newInviteCode
    });
    return result;
  }

  async delete(roomId: number): Promise<Room> {
    const room = await this.getRoom(roomId);
    await this.roomRepository.remove(room);
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

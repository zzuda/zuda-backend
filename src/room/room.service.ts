import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { RoomError } from 'src/shared/errors/room.error';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Room } from './room.entity';
import { RoomMember, RoomMemberDocument } from './room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectModel(RoomMember.name) private readonly roomMemberModel: Model<RoomMemberDocument>
  ) {}

  async getRoom(roomId: number): Promise<Room> {
    const room = await this.roomRepository.findOne(roomId);

    if (!room) throw new WsException(RoomError.ROOM_NOT_FOUND);

    return room;
  }

  async getRoomMember(roomId: number): Promise<RoomMemberDocument> {
    const roomMember = this.roomMemberModel.findOne({
      roomId
    });
    if (!roomMember) throw new WsException(RoomError.ROOM_NOT_FOUND);

    return (roomMember as unknown) as RoomMemberDocument;
  }

  async existsRoom(roomId: number): Promise<boolean> {
    try {
      const room = this.getRoom(roomId);
      if (room) return true;
    } catch (e) {
      if (e instanceof WsException) {
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

  async joinRoom(roomId: number, userId?: string): Promise<void> {
    const isFull = await this.isRoomFull(roomId);
    if (isFull) throw new ConflictException(RoomError.ROOM_IS_FULL);

    const guestUserId = userId || this.generateGuestId();
    const roomMember = await this.getRoomMember(roomId);

    if (roomMember.members.includes(guestUserId))
      throw new WsException(RoomError.GUEST_ALREADY_JOIN);

    roomMember.members.push(guestUserId);
    roomMember.save();
  }

  async quitRoom(roomId: number, userId: string): Promise<void> {
    const exists = this.existsRoom(roomId);

    if (!exists) throw new WsException(RoomError.ROOM_NOT_FOUND);

    const roomMember = await this.getRoomMember(roomId);

    if (!roomMember.members.includes(userId)) throw new WsException(RoomError.GUEST_NOT_FOUND);

    const guestIndex = roomMember.members.findIndex((i) => i === userId);

    roomMember.members.splice(guestIndex, 1);
    roomMember.save();
  }
}

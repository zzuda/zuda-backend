import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomError } from 'src/shared/errors/room.error';
import { RoomMember, RoomMemberDocument } from '../room.schema';
import { RoomService } from './room.service';

@Injectable()
export class RoomMemberService {
  constructor(
    private readonly roomService: RoomService,
    @InjectModel(RoomMember.name) private readonly roomMemberModel: Model<RoomMemberDocument>
  ) {}

  async getRoomMember(roomId: number): Promise<RoomMemberDocument> {
    const roomMember = await this.roomMemberModel
      .findOne({
        roomId
      })
      .exec();
    if (!roomMember) throw new NotFoundException(RoomError.ROOM_NOT_FOUND);

    return (roomMember as unknown) as RoomMemberDocument;
  }

  async isRoomFull(roomId: number): Promise<boolean> {
    const { maxPeople } = await this.roomService.getRoom(roomId);
    const roomMember = await this.getRoomMember(roomId);
    const currentMember = roomMember.members.length;

    if (currentMember === maxPeople) return true;
    return false;
  }
}

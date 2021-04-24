import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { RoomError } from 'src/shared/errors/room.error';
import { RoomInteractReturn } from 'src/types';
import { v4 as uuidv4 } from 'uuid';
import { RoomMemberService } from './room-member.service';
import { RoomService } from './room.service';

@Injectable()
export class RoomControllService {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomMemberService: RoomMemberService
  ) {}

  private generateGuestId(): string {
    return uuidv4();
  }

  async joinRoom(roomId: number, userId?: string): Promise<RoomInteractReturn> {
    const isFull = await this.roomMemberService.isRoomFull(roomId);
    if (isFull) throw new WsException(RoomError.ROOM_IS_FULL);

    const guestUserId = userId || this.generateGuestId();
    const roomMember = await this.roomMemberService.getRoomMember(roomId);

    if (roomMember.members.includes(guestUserId))
      throw new WsException(RoomError.GUEST_ALREADY_JOIN);

    roomMember.members.push(guestUserId);
    await roomMember.save();

    const room = await this.roomService.getRoom(roomId);

    return {
      guestId: guestUserId,
      roomInfo: room
    };
  }

  async quitRoom(roomId: number, userId: string): Promise<void> {
    const exists = await this.roomService.existsRoom(roomId);

    if (!exists) throw new WsException(RoomError.ROOM_NOT_FOUND);

    const roomMember = await this.roomMemberService.getRoomMember(roomId);

    if (!roomMember.members.includes(userId)) throw new WsException(RoomError.GUEST_NOT_FOUND);

    const guestIndex = roomMember.members.findIndex((i) => i === userId);

    roomMember.members.splice(guestIndex, 1);
    await roomMember.save();
  }
}

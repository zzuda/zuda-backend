import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { RoomError } from 'src/shared/errors/room.error';
import { RoomInteractReturn } from 'src/types';
import { v4 as uuidv4 } from 'uuid';
import { RoomMemberService } from './room-member.service';
import { RoomService } from './room.service';

interface JoinRoomOption {
  readonly name?: string;
  readonly userId?: string;
}

@Injectable()
export class RoomControllService {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomMemberService: RoomMemberService
  ) {}

  private generateGuestId(): string {
    return uuidv4();
  }

  async joinRoom(roomId: number, options: JoinRoomOption): Promise<RoomInteractReturn> {
    const isFull = await this.roomMemberService.isRoomFull(roomId);
    if (isFull) throw new WsException(RoomError.ROOM_IS_FULL);

    const { name, userId } = options;

    const guestOrUserId = userId || this.generateGuestId();
    const roomMember = await this.roomMemberService.getRoomMember(roomId);

    const existsMember = roomMember.members.find((user) => user.id === guestOrUserId);
    const existsMemberByName = roomMember.members.find((user) => user.name === name);
    if (existsMember || existsMemberByName) throw new WsException(RoomError.GUEST_ALREADY_JOIN);

    roomMember.members.push({
      id: guestOrUserId,
      owner: userId !== undefined,
      name
    });
    await roomMember.save();

    const room = await this.roomService.getRoom(roomId);

    return {
      id: guestOrUserId,
      roomInfo: room
    };
  }

  async quitRoom(roomId: number, guestId: string): Promise<void> {
    const exists = await this.roomService.existsRoom(roomId);

    if (!exists) throw new WsException(RoomError.ROOM_NOT_FOUND);

    const roomMember = await this.roomMemberService.getRoomMember(roomId);

    const guestIndex = roomMember.members.findIndex((i) => i.id === guestId);
    if (guestIndex === -1) throw new WsException(RoomError.GUEST_NOT_FOUND);

    const guest = roomMember.members[guestIndex];
    if (guest.owner) throw new WsException(RoomError.OWNER_CAN_NOT_QUIT);

    roomMember.members.splice(guestIndex, 1);
    await roomMember.save();
  }
}

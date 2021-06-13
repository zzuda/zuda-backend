import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';
import {
  JoinOwnerSocketRequest,
  JoinSocketRequest,
  KickSocketRequest,
  QuitSocketRequest
} from 'src/types/socket';
import { Logger } from '@nestjs/common';
import { RoomControllService } from './services/room-controll.service';
import { RoomService } from './services/room.service';
import { RoomError } from '../shared/errors/room.error';
import { UserService } from '../user/user.service';
import { UserError } from '../shared/errors/user.error';

@WebSocketGateway()
export class RoomGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomControllService: RoomControllService,
    private readonly userService: UserService
  ) {}

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinSocketRequest
  ): Promise<WsResponse<unknown>> {
    try {
      const { inviteCode, name } = data;

      const { roomId } = await this.roomService.getRoomByCode(inviteCode);

      const result = await this.roomControllService.joinRoom(roomId, socket.id, {
        name
      });
      socket.join(`room-${roomId}`);

      return {
        event: 'join',
        data: result
      };
    } catch (e) {
      throw new WsException(e.response || e.error);
    }
  }

  @SubscribeMessage('joinOwner')
  async joinOwner(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinOwnerSocketRequest
  ): Promise<WsResponse<unknown>> {
    try {
      const { roomId, ownerId } = data;

      const existsUser = await this.userService.existsUserByUUID(ownerId);

      if (!existsUser) {
        throw new WsException(UserError.USER_NOT_FOUND);
      }

      const exists = await this.roomService.existsRoom(roomId);

      if (!exists) {
        throw new WsException(RoomError.ROOM_NOT_FOUND);
      }

      const result = await this.roomControllService.joinRoom(roomId, socket.id, {
        userId: ownerId
      });
      socket.join(`room-${roomId}`);

      return {
        event: 'joinOwner',
        data: result
      };
    } catch (e) {
      throw new WsException(e.response || e.error);
    }
  }

  @SubscribeMessage('quit')
  async quit(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: QuitSocketRequest
  ): Promise<WsResponse<unknown>> {
    try {
      const { roomId, guestId } = data;

      await this.roomControllService.quitRoom(roomId, guestId);
      socket.leave(`room-${roomId}`);

      return {
        event: 'quit',
        data: true
      };
    } catch (e) {
      throw new WsException(e.response || e.error);
    }
  }

  @SubscribeMessage('kick')
  async kick(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: KickSocketRequest
  ): Promise<WsResponse<unknown>> {
    try {
      const { roomId, guestId } = data;

      const { roomId: resultRoom, guest } = await this.roomControllService.kickGuest(
        roomId,
        guestId
      );

      const targetSocket = this.server.sockets.sockets[guest.socketId];

      targetSocket.leave(`room-${roomId}`);
      targetSocket.emit('kickComplete', {
        roomId: resultRoom,
        guestId: guest.id
      });

      return {
        event: 'kick',
        data: true
      };
    } catch (e) {
      Logger.error(e);
      throw new WsException(e.response || e.error);
    }
  }
}

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
  WsResponse
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';
import { JoinSocketRequest, QuitSocketRequest } from 'src/types/socket';
import { RoomControllService } from './services/room-controll.service';
import { RoomService } from './services/room.service';

@WebSocketGateway({
  namespace: 'room'
})
export class RoomGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomControllService: RoomControllService
  ) {}

  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinSocketRequest
  ): Promise<WsResponse<unknown>> {
    try {
      const { inviteCode, name } = data;

      const { roomId } = await this.roomService.getRoomByCode(inviteCode);

      const result = await this.roomControllService.joinRoom(roomId, {
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
}

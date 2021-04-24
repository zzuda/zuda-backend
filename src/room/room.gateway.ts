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
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: 'room'
})
export class RoomGateway {
  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinSocketRequest
  ): Promise<WsResponse<unknown>> {
    try {
      const { inviteCode } = data;

      const { roomId } = await this.roomService.getRoomByCode(inviteCode);

      const result = await this.roomService.joinRoom(roomId);
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
      const { roomId, userId } = data;

      await this.roomService.quitRoom(roomId, userId);
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

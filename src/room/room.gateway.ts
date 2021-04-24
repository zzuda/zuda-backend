import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';
import { JoinSocketRequest, QuitSocketRequest } from 'src/types/socket';
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: 'room'
})
export class RoomGateway {
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer()
  private readonly server!: Server;

  @SubscribeMessage('join')
  join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: JoinSocketRequest
  ): WsResponse<unknown> {
    const { roomId } = data;

    const result = this.roomService.joinRoom(roomId);
    socket.join(`room-${roomId}`);

    return {
      event: 'join',
      data: result
    };
  }

  @SubscribeMessage('quit')
  quit(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: QuitSocketRequest
  ): WsResponse<unknown> {
    const { roomId, userId } = data;

    this.roomService.quitRoom(roomId, userId);
    socket.leave(`room-${roomId}`);

    return {
      event: 'quit',
      data: true
    };
  }
}

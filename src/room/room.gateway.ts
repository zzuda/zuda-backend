import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: 'room'
})
export class RoomGateway {
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer()
  private readonly server!: Server;

  @SubscribeMessage('join')
  join(@MessageBody() data: string): WsResponse<unknown> {
    const { roomId } = (data as unknown) as Record<string, any>;

    this.roomService.joinRoom(roomId);

    return {
      event: 'join',
      data: true
    };
  }

  @SubscribeMessage('quit')
  quit(@MessageBody() data: string): WsResponse<unknown> {
    const { roomId, userId } = (data as unknown) as Record<string, any>;

    this.roomService.quitRoom(roomId, userId);

    return {
      event: 'quit',
      data: true
    };
  }
}

import { Logger } from '@nestjs/common';
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

@WebSocketGateway()
export class RoomGateway {
  @WebSocketServer()
  private readonly server!: Server;

  @SubscribeMessage('join')
  join(@ConnectedSocket() client: Socket, @MessageBody() data: string): WsResponse<unknown> {
    Logger.debug(data);
    return {
      event: 'join',
      data: 'test'
    };
  }

  @SubscribeMessage('quit')
  quit(@ConnectedSocket() client: Socket, @MessageBody() data: string): WsResponse<unknown> {
    Logger.debug(data);
    return {
      event: 'quit',
      data: 'test'
    };
  }
}

import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    this.server.emit('message', payload);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: any, room: string): void {
    client.join(room);
    this.server.to(room).emit('message', `${client.id} has joined the room`);
  }

  @SubscribeMessage('leave')
  handleLeaveRoom(client: any, room: string): void {
    client.leave(room);
    this.server.to(room).emit('message', `${client.id} has left the room`);
  }
}

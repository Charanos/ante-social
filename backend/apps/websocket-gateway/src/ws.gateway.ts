import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from './ws.auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: restrict in prod
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(WsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.logger.log(`Client ${client.id} joined room ${data.room}`);
    return { event: 'joined_room', data: data.room };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    this.logger.log(`Client ${client.id} left room ${data.room}`);
    return { event: 'left_room', data: data.room };
  }

  // Method called by Kafka Consumer to broadcast events
  broadcastToRoom(room: string, event: string, payload: any) {
    this.server.to(room).emit(event, payload);
    this.logger.debug(`Broadcast to ${room}: ${event}`);
  }

  broadcastToUser(userId: string, event: string, payload: any) {
    // Requires mapping userId -> socketId, or using room='user:userId'
    // We'll use the room approach as it handles multi-device support automatically
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}

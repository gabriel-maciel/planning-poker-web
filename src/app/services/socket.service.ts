import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  joinRoom(
    room: string,
    playerName: string,
    callback: (response: { success: boolean; message?: string }) => void,
  ) {
    this.socket.emit('joinRoom', room, playerName, callback);
  }

  onUpdatePlayers(): Observable<{ [key: string]: string }> {
    return this.socket.fromEvent<{ [key: string]: string }>('updatePlayers');
  }

  onUpdateSelectedCards(): Observable<{ [key: string]: string }> {
    return this.socket.fromEvent<{ [key: string]: string }>(
      'updateSelectedCards',
    );
  }

  onUpdateGameState(): Observable<any> {
    return this.socket.fromEvent<any>('updateGameState');
  }

  onCardSelected(): Observable<string> {
    return this.socket.fromEvent<string>('cardSelected');
  }

  selectCard(room: string, data: { playerName: string; selectedCard: string }) {
    this.socket.emit('cardSelected', room, data);
  }

  revealCards(room: string) {
    this.socket.emit('revealCards', room);
  }

  resetGame(room: string) {
    this.socket.emit('resetGame', room);
  }
}

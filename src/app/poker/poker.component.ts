import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit {
  players: Map<string, string> = new Map();
  cards = ['1', '2', '3', '5', '8', '13', '21', '?'];
  selectedCards: Map<string, string> = new Map();

  constructor(private socket: Socket) {}

  ngOnInit() {
    this.socket.on('updatePlayers', (players: { [key: string]: string }) => {
      this.players = new Map(Object.entries(players));
    });

    this.socket.on('cardSelected', (data: any) => {
      this.selectedCards.set(data.playerName, data.selectedCard);
    });
  }

  selectCard(card: string) {
    const playerName = this.players.get(this.socket.ioSocket.id);
    if (playerName) {
      this.selectedCards.set(playerName, card);
      this.socket.emit('cardSelected', {
        playerName: playerName,
        selectedCard: card,
      });
    }
  }
}

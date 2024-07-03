import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit, OnDestroy {
  players: Map<string, string> = new Map(); // Map for player IDs and names
  cards = ['1', '2', '3', '5', '8', '13', '21', '?'];
  selectedCards: Map<string, string> = new Map(); // Map for player names and selected cards
  playerName: string | null = null;
  errorMessage: string | null = null;
  readyToPlay: boolean = false;

  constructor(private socket: Socket) {}

  ngOnInit() {
    this.socket.on('updatePlayers', (players: { [key: string]: string }) => {
      this.players = new Map(Object.entries(players));
    });

    this.socket.on(
      'updateSelectedCards',
      (selectedCards: { [key: string]: string }) => {
        this.selectedCards = new Map(Object.entries(selectedCards));
      },
    );

    this.socket.on('cardSelected', (data: any) => {
      this.selectedCards.set(data.playerName, data.selectedCard);
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  setPlayerName() {
    if (this.playerName) {
      this.socket.emit(
        'newPlayer',
        this.playerName,
        (response: { success: boolean; message?: string }) => {
          if (!response.success) {
            this.errorMessage = response.message || 'An error occurred';
          } else {
            this.errorMessage = null;
            this.readyToPlay = true;
          }
        },
      );
    }
  }

  selectCard(card: string) {
    if (!this.readyToPlay) {
      return;
    }
    const playerName = this.players.get(this.socket.ioSocket.id);
    if (playerName) {
      this.selectedCards.set(playerName, card);
      this.socket.emit('cardSelected', {
        playerName: playerName,
        selectedCard: card,
      });
    }
  }

  isActivePlayer(playerName: string): boolean {
    if (!this.readyToPlay) {
      return false;
    }
    return this.playerName === playerName;
  }
}

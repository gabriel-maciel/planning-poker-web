import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

interface GameState {
  revealed: boolean;
}

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit, OnDestroy {
  players: Map<string, string> = new Map(); // Map for player IDs and names
  cards = ['1', '2', '3', '5', '8', '13', '21', '?'];
  selectedCards: Map<string, string> = new Map(); // Map for player names and selected cards
  cardSelections: Map<string, string> = new Map(); // Map for player names and selected card symbols ('-' or actual card)
  playerName: string | null = null;
  errorMessage: string | null = null;
  readyToPlay: boolean = false;
  gameState: GameState = {
    revealed: false,
  };
  currentPlayerCard: string | null = null;

  constructor(private socket: Socket) {}

  ngOnInit() {
    this.socket.on('updatePlayers', (players: { [key: string]: string }) => {
      this.players = new Map(Object.entries(players));
    });

    this.socket.on(
      'updateSelectedCards',
      (selectedCards: { [key: string]: string }) => {
        this.selectedCards = new Map(Object.entries(selectedCards));
        this.cardSelections = new Map(Object.entries(selectedCards));
      },
    );

    this.socket.on('updateGameState', (state: GameState) => {
      this.gameState = state;
    });

    this.socket.on('cardSelected', (playerName: string) => {
      this.cardSelections.set(playerName, '-');
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
    if (!this.readyToPlay || this.gameState.revealed || !this.playerName) {
      return;
    }
    this.socket.emit('cardSelected', {
      playerName: this.playerName,
      selectedCard: card,
    });
    this.cardSelections.set(this.playerName, '-');
    this.currentPlayerCard = card;
  }

  revealCards() {
    this.socket.emit('revealCards');
  }

  isActivePlayer(playerName: string): boolean {
    if (!this.readyToPlay) {
      return false;
    }
    return this.playerName === playerName;
  }

  resetGame() {
    this.socket.emit('resetGame');
    this.cardSelections.clear();
    this.currentPlayerCard = null;
  }

  isCurrentPlayer(playerName: string): boolean {
    return this.playerName === playerName;
  }

  isCardSelected(card: string): boolean {
    return this.currentPlayerCard === card;
  }
}

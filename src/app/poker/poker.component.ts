import { Component } from '@angular/core';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent {
  players = [
    { name: 'Player 1', selectedCard: '-' },
    { name: 'Player 2', selectedCard: '-' },
    { name: 'Player 3', selectedCard: '-' },
  ];

  cards = ['1', '2', '3', '5', '8', '13', '21', '?'];

  selectCard(playerIndex: number, card: string) {
    this.players[playerIndex].selectedCard = card;
  }
}

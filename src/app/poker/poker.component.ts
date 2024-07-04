import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit, OnDestroy {
  playerName: string | null = null;
  room: string | null = null;
  errorMessage: string | null = null;
  readyToPlay: boolean = false;
  cards = ['1', '2', '3', '5', '8', '13', '21', '?'];
  currentPlayerCard: string | null = null;

  players$: Observable<Map<string, string>>;
  selectedCards$: Observable<Map<string, string>>;
  cardSelections$: Observable<Map<string, string>>;
  gameState$: Observable<any>;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private socketService: SocketService,
    private gameService: GameService,
  ) {
    this.players$ = this.gameService.players$;
    this.selectedCards$ = this.gameService.selectedCards$;
    this.cardSelections$ = this.gameService.cardSelections$;
    this.gameState$ = this.gameService.gameState$;
  }

  ngOnInit() {
    this.subscriptions.add(
      this.socketService
        .onUpdatePlayers()
        .subscribe((players: { [key: string]: string }) => {
          this.gameService.setPlayers(players);
        }),
    );

    this.subscriptions.add(
      this.socketService
        .onUpdateSelectedCards()
        .subscribe((selectedCards: { [key: string]: string }) => {
          this.gameService.setSelectedCards(selectedCards);
        }),
    );

    this.subscriptions.add(
      this.socketService.onUpdateGameState().subscribe((state: any) => {
        this.gameService.setGameState(state);
      }),
    );

    this.subscriptions.add(
      this.socketService.onCardSelected().subscribe((playerName: string) => {
        this.gameService.setCardSelection(playerName, '-');
      }),
    );

    this.subscriptions.add(
      this.gameService.currentPlayerCard$.subscribe((card: string | null) => {
        this.currentPlayerCard = card;
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  joinRoom() {
    if (this.room && this.playerName) {
      this.socketService.joinRoom(
        this.room,
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
    if (!this.readyToPlay || !this.room || !this.playerName) {
      return;
    }
    this.socketService.selectCard(this.room, {
      playerName: this.playerName,
      selectedCard: card,
    });
    this.gameService.setCardSelection(this.playerName, '-');
    this.gameService.setCurrentPlayerCard(card);
  }

  revealCards() {
    if (this.room) {
      this.socketService.revealCards(this.room);
    }
  }

  resetGame() {
    if (this.room) {
      this.socketService.resetGame(this.room);
      this.gameService.resetGame();
    }
  }

  isActivePlayer(playerName: string): boolean {
    return this.readyToPlay && this.playerName === playerName;
  }

  isCardSelected(card: string): boolean {
    return this.currentPlayerCard === card;
  }

  mapToArray(
    map: Map<string, string> | null,
  ): { key: string; value: string }[] {
    if (!map) return [];
    return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface GameState {
  revealed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private playersSubject = new BehaviorSubject<Map<string, string>>(new Map());
  private selectedCardsSubject = new BehaviorSubject<Map<string, string>>(
    new Map(),
  );
  private cardSelectionsSubject = new BehaviorSubject<Map<string, string>>(
    new Map(),
  );
  private gameStateSubject = new BehaviorSubject<GameState>({
    revealed: false,
  });
  private currentPlayerCardSubject = new BehaviorSubject<string | null>(null);

  players$ = this.playersSubject.asObservable();
  selectedCards$ = this.selectedCardsSubject.asObservable();
  cardSelections$ = this.cardSelectionsSubject.asObservable();
  gameState$ = this.gameStateSubject.asObservable();
  currentPlayerCard$ = this.currentPlayerCardSubject.asObservable();

  setPlayers(players: { [key: string]: string }) {
    this.playersSubject.next(new Map(Object.entries(players)));
  }

  setSelectedCards(selectedCards: { [key: string]: string }) {
    this.selectedCardsSubject.next(new Map(Object.entries(selectedCards)));
    this.cardSelectionsSubject.next(new Map(Object.entries(selectedCards)));
  }

  setGameState(state: GameState) {
    this.gameStateSubject.next(state);
  }

  setCardSelection(playerName: string, card: string) {
    const cardSelections = this.cardSelectionsSubject.getValue();
    cardSelections.set(playerName, card);
    this.cardSelectionsSubject.next(cardSelections);
  }

  setCurrentPlayerCard(card: string) {
    this.currentPlayerCardSubject.next(card);
  }

  resetGame() {
    this.cardSelectionsSubject.next(new Map());
    this.currentPlayerCardSubject.next(null);
  }
}

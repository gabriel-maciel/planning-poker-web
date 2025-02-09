import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() playerName: string = '';
  @Input() selectedCard: string = '';
  @Input() isActive: boolean = false;
  @Input() isCurrentPlayer: boolean = false;
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  playerName: any;

  constructor(private socket: Socket) {
    this.playerName = prompt('Enter your name');
  }

  ngOnInit() {
    this.socket.emit('newPlayer', this.playerName);
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}

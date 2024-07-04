import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { PokerComponent } from './poker/poker.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { KeyValuePipe } from './keyvalue.pipe';
import { environment } from '../environments/environment';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

@NgModule({
  declarations: [AppComponent, PlayerComponent, PokerComponent, KeyValuePipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotesModule } from './notes/notes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DbService } from './services/in-memory-db/in-memory-db.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WebSocketService } from './services/web-socket/web-socket.service';
import { WS_CONFIG } from './services/web-socket/ws-config.model';
import { MakeIdModule } from 'makeid';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NotesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(DbService),
    MakeIdModule
  ],
  providers: [
    DbService,
    {
      provide: WS_CONFIG,
      useValue: {
        url: environment.WS_ENDPOINT
      }
    },
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

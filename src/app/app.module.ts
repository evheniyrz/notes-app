import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotesModule } from './notes/notes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DbService } from './services/in-memory-db/in-memory-db.service';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketService } from './services/web-socket/web-socket.service';
import { WS_CONFIG } from './services/web-socket/ws-config.model';
import { MakeIdModule } from 'makeid';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EntityDataModule } from '@ngrx/data';
import { entityConfig } from './entity-metadata';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';

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
    MakeIdModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EntityDataModule.forRoot(entityConfig),
    StoreRouterConnectingModule.forRoot()
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

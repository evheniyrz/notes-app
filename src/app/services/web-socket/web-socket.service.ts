import { Inject, Injectable } from '@angular/core';
import { interval, Observable, Observer, ReplaySubject, Subject, SubscriptionLike } from 'rxjs';
import { distinctUntilChanged, filter, map, share, takeWhile } from 'rxjs/operators';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { WS_CONFIG, WsConfig } from './ws-config.model';
import { WsMessage } from './ws-message.model';
import { WsService } from './ws-service.model';

@Injectable()
export class WebSocketService implements WsService {
  private config!: WebSocketSubjectConfig<WsMessage<any>>;

  private websocketSub!: SubscriptionLike;
  private statusSub!: SubscriptionLike;

  private reconnection$!: Observable<number> | null;
  private websocket$!: WebSocketSubject<WsMessage<any>> | null;

  private connection$!: Observer<boolean>;

  private wsMessages$!: Subject<WsMessage<any>>;

  private reconnectInterval!: number;

  private reconnectAttempts!: number;

  private isConnected!: boolean;

  public status!: Observable<boolean>;

  constructor(@Inject(WS_CONFIG) private wsConfig: WsConfig) {
    this.wsMessages$ = new Subject<WsMessage<any>>();
    this.reconnectInterval = wsConfig.reconnectInterval || 5000;
    this.reconnectAttempts = wsConfig.reconnectAttempts || 10;

    this.config = {
      url: wsConfig.url,
      closeObserver: {
        next: (event: CloseEvent) => {
          this.websocket$ = null;
          this.connection$.next(false);
        }
      },
      openObserver: {
        next: (event: Event) => {
          console.log('WebSocket connected!');
          this.connection$.next(true);
        }
      }
    };

    // connection status
    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    // run reconnect if not connection
    this.statusSub = this.status
      .subscribe((isConnected) => {
        this.isConnected = isConnected;

        if (!this.reconnection$ && typeof (isConnected) === 'boolean' && !isConnected) {
          this.reconnect();
        }
      });

    this.websocketSub = this.wsMessages$.subscribe(
      {
        error: (error: ErrorEvent) => console.error('WebSocket error!', error)
      }
    );

    this.connect();
  }

  ngOnDestroy() {
    this.websocketSub.unsubscribe();
    this.statusSub.unsubscribe();
  }



  /*
  * on message event
  * */
  public on<T>(event: string): Observable<T> {
    // if (event) {
    return this.wsMessages$.pipe(
      filter((message: WsMessage<T>) => message.event === event),
      map((message: WsMessage<T>) => message.data)
    );
    // }
  }


  /*
  * on message to server
  * */
  public send(event: string, data: any = {}): void {
    if (event && this.isConnected) {
      this.websocket$?.next(<any>JSON.stringify({ event, data }));
    } else {
      console.error('Send error!');
    }
  }

  /*
    * connect to WebSocked
    * */
  private connect(): void {
    this.websocket$ = webSocket(this.config);
    this.websocket$.asObservable().subscribe(
      {
        next: (message) => {
          this.wsMessages$.next(message)
        },
        error: (error: Event) => {
          if (!this.websocket$) {
            // run reconnect if errors
            this.reconnect();
          }
        }
      }
    );
  }


  /*
  * reconnect if not connecting or errors
  * */
  private reconnect(): void {
    this.reconnection$ = interval(this.reconnectInterval)
      .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

    this.reconnection$.subscribe(
      () => this.connect(),
      null,
      () => {
        // Subject complete if reconnect attemts ending
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.wsMessages$.complete();
          this.connection$.complete();
        }
      });
  }

}

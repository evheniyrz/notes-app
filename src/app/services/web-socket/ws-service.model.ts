import { Observable } from 'rxjs';

export interface WsService {
  on<T>(event: string): Observable<T>;
  send(event: string, data: any): void;
  status: Observable<boolean>;
}
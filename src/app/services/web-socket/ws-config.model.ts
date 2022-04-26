import { InjectionToken } from '@angular/core';

export const WS_CONFIG: InjectionToken<WsConfig> = new InjectionToken('websocket');

export interface WsConfig {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

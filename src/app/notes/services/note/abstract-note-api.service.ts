import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoteApiConfiguration } from './note-api.model';

export abstract class AbstractNoteEndpointService<T extends { id: string }> {
  constructor(private endpoint: NoteApiConfiguration, private httpClient: HttpClient) { }

  public get(itemId: string = ''): Observable<any> {
    return this.httpClient.get(`${this.getEndpointPath()}/${itemId}`);
  }

  public post(payload: T): Observable<any> {
    return this.httpClient.post(this.getEndpointPath(), payload);
  }

  public delete(itemId: string): Observable<any> {
    return this.httpClient.delete(`${this.getEndpointPath()}/${itemId}`);
  }

  public put(payload: T): Observable<any> {
    return this.httpClient.put(`${this.getEndpointPath()}/${payload.id}`, payload);
  }

  private getEndpointPath(): string {
    return `${this.endpoint.api}/${this.endpoint.path}`
  }
}
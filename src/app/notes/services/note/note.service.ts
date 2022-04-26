import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { NOTE_API_CONFIGURATION } from '../../notes.module';
import { AbstractNoteEndpointService } from './abstract-note-api.service';
import { NoteApiConfiguration } from './note-api.model';

@Injectable()
export class NoteApiService extends AbstractNoteEndpointService<Note> {

  constructor(@Inject(NOTE_API_CONFIGURATION) apiConfig: NoteApiConfiguration, httpClient: HttpClient) {
    super(apiConfig, httpClient);
    console.log({ apiConfig })
  }

  public getNotes(): Observable<Note[]> {
    return this.get();
  }

  public getNote(id: string): Observable<Note> {
    return this.get(id);
  }

  public createNote(payload: Note): Observable<Note> {
    return this.post(payload);
  }

  public deleteNote(id: string): Observable<Note> {
    return this.delete(id);
  }

  public updateNote(payload: Note): Observable<Note> {
    return this.put(payload);
  }
}

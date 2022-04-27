import { Component, OnInit } from '@angular/core';
import { concatMap, map, Observable, tap } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';
import { NoteApiService } from '../../services/note/note.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  public noteList$: Observable<Note[]>;

  constructor(private wsService: WebSocketService, private service: NoteApiService) {
    this.noteList$ = this.wsService.on(WS_NOTE_EVENTS.ON.UPDATE_DATA).pipe(
      map((resp) => { return this.getSortedNotes(resp as Note[]) })
    ) as Observable<Note[]>;
  }

  ngOnInit(): void {
  }

  public deleteNote(id: string): void {
    this.service.deleteNote(id).pipe(
      concatMap(() => {
        return this.service.getNotes().pipe((
          tap((response: Note[]) => this.wsService.send(WS_NOTE_EVENTS.SEND.UPDATE_DATA, response))
        ))
      })
    ).subscribe();
  }

  private getSortedNotes(input: Note[]): Note[] {
    return input.sort((a: Note, b: Note) => {
      if (a.updateAt > b.updateAt) return -1;
      if (a.updateAt < b.updateAt) return 1;
      return 0;
    })
  }

}

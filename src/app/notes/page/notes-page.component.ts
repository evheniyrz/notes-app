import { Component, OnInit } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';
import { NoteApiService } from '../services/note/note.service';

@Component({
  selector: 'app-notes-page',
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss']
})
export class NotesPageComponent implements OnInit {

  constructor(private noteService: NoteApiService, private wsService: WebSocketService) { }

  ngOnInit(): void {
    this.wsService.status.pipe(
      filter((status: boolean) => status),
      switchMap(() => this.noteService.getNotes().pipe(
        tap((response: Note[]) => {
          this.wsService.send(WS_NOTE_EVENTS.SEND.UPDATE_DATA, response)
        })
      ))
    ).subscribe();
  }

}

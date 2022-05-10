import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';
import { ListDataSource } from 'src/app/shared/list/data-source/list-data-source';
import { NoteApiService } from '../services/note/note.service';

@Component({
  selector: 'app-notes-page',
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss']
})
export class NotesPageComponent implements OnInit, OnDestroy {

  public noteDataSource: ListDataSource<Note> = new ListDataSource([] as Note[]);

  private onDestroy$: Subject<void> = new Subject();

  constructor(private noteService: NoteApiService, private wsService: WebSocketService, private router: Router) {
    this.noteDataSource.sort = this.getSortedNotes;
  }

  ngOnInit(): void {
    this.wsService.status.pipe(
      filter((status: boolean) => status),
      switchMap(() => this.noteService.getNotes().pipe(
        tap((response: Note[]) => {
          this.wsService.send(WS_NOTE_EVENTS.SEND.UPDATE_DATA, response);
        })
      )),
      takeUntil(this.onDestroy$)
    ).subscribe();

    this.wsService.on(WS_NOTE_EVENTS.ON.UPDATE_DATA).pipe(
      tap((resp) => {
        this.noteDataSource.data = resp as Note[];
      }),
      takeUntil(this.onDestroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();

    if (null != this.onDestroy$) {
      this.onDestroy$ = void 0 as any;
    }
  }

  public deleteNote(id: string, isActive: boolean): void {
    this.noteService.deleteNote(id).pipe(
      concatMap(() => {
        return this.noteService.getNotes().pipe((
          tap((response: Note[]) => {
            this.wsService.send(WS_NOTE_EVENTS.SEND.UPDATE_DATA, response);
            if (isActive) {
              this.router.navigate(['notes']);
            }
          })
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

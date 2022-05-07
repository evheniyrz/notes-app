import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, Subject, takeUntil, tap } from 'rxjs';
import { NoteApiService } from 'src/app/notes/services/note/note.service';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';
import { SearchValuesState } from '../../models/searc.model';
import { ListDataSource } from './entity/list-data-source';
import { NotesFilterService } from './services/note-filter/note-filter.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit, OnDestroy {

  public noteDataSource: ListDataSource<Note> = new ListDataSource([] as Note[]);

  public isSelected = false;

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private wsService: WebSocketService,
    private service: NoteApiService,
    private router: Router,
    private filterService: NotesFilterService<Note>) {
    this.filterService.dataSourceInit(this.noteDataSource);
  }

  ngOnInit(): void {
    this.wsService.on(WS_NOTE_EVENTS.ON.UPDATE_DATA).pipe(
      tap((resp) => {
        this.noteDataSource.data = this.getSortedNotes(resp as Note[]);

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
    this.service.deleteNote(id).pipe(
      concatMap(() => {
        return this.service.getNotes().pipe((
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

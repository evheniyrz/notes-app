import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, concatMap, map, Observable, tap } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';
import { NoteApiService } from '../../services/note/note.service';
import { SearchValuesState } from './models/searc.model';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  public noteList$: Observable<Note[]>;

  public filteredNoteList$: BehaviorSubject<Note[]> = new BehaviorSubject([] as Note[]);

  private searchValues$: BehaviorSubject<SearchValuesState> = new BehaviorSubject({});

  private noteListData: Note[] = [];

  constructor(private wsService: WebSocketService, private service: NoteApiService) {
    this.noteList$ = this.wsService.on(WS_NOTE_EVENTS.ON.UPDATE_DATA).pipe(
      map((resp) => {
        this.noteListData = this.getSortedNotes(resp as Note[]);
        this.filteredNoteList$.next(this.getSortedNotes(resp as Note[]));
        return resp;
      })
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

  public search(search: SearchValuesState): void {
    const foundNotes: Set<Note> = new Set();
    const updatedSearchState: SearchValuesState = {
      ...this.searchValues$.getValue(),
      ...search
    };

    if ((null == search.tags || search.tags?.length === 0) && (null == search.text || search.text?.[0]?.length === 0)) {
      this.filteredNoteList$.next(this.noteListData);
    } else {
      const filterValues: string[] = Object.values(updatedSearchState)?.flat();

      const existingFilteredNotes: Note[] = this.filteredNoteList$.getValue();
      filterValues.forEach((filterValue: string) => {
        existingFilteredNotes.forEach((note: Note) => {
          if (note.title.includes(filterValue) || note.tags.includes(filterValue)) {
            foundNotes.add(note);
          }
        });
      });

      this.filteredNoteList$.next(this.getSortedNotes(Array.from(foundNotes)));
    }

    this.searchValues$.next(updatedSearchState);
    this.wsService.send(WS_NOTE_EVENTS.SEND.SEARCH, this.filteredNoteList$.getValue());
  }

  private getSortedNotes(input: Note[]): Note[] {
    return input.sort((a: Note, b: Note) => {
      if (a.updateAt > b.updateAt) return -1;
      if (a.updateAt < b.updateAt) return 1;
      return 0;
    })
  }

}

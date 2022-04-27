import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatChipListChange } from '@angular/material/chips';
import { map, merge, Observable } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';
import { SearchValuesState } from '../../models/searc.model';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Output() onSearch: EventEmitter<SearchValuesState> = new EventEmitter();

  public tagList$: Observable<string[]>;

  constructor(private wsService: WebSocketService) {
    this.tagList$ = merge(
      this.wsService.on(WS_NOTE_EVENTS.ON.UPDATE_DATA).pipe(
        map((resp) => { return this.createTagList(resp as Note[]) })
      ),

      this.wsService.on(WS_NOTE_EVENTS.ON.SEARCH).pipe(
        map((resp) => { return this.createTagList(resp as Note[]) })
      )
    );
  }

  ngOnInit(): void {
  }

  public createSearch(chipList: MatChipListChange): void {
    this.onSearch.next({ tags: chipList.value });
  }

  private createTagList(input: Note[]): string[] {
    const allTags: string[] = input.reduce((acc: string[], note: Note) => {
      acc.push(...note.tags)
      return acc;
    }, []);

    const uniqTags: Set<string> = new Set(allTags);
    return Array.from(uniqTags);
  }

}

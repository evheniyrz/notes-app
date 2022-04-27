import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  public tagList$: Observable<string[]>;

  constructor(private wsService: WebSocketService) {
    this.tagList$ = this.wsService.on(WS_NOTE_EVENTS.ON.UPDATE_DATA).pipe(
      map((resp) => { return this.createTagList(resp as Note[]) })
    ) as Observable<string[]>;
  }

  ngOnInit(): void {
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

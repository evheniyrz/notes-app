import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { NoteApiService } from '../services/note/note.service';

@Component({
  selector: 'app-notes-page',
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss']
})
export class NotesPageComponent implements OnInit {

  constructor(private noteService: NoteApiService, private wsService: WebSocketService) { }

  ngOnInit(): void {
    this.noteService.getNotes().subscribe(
      resp => console.log('===RESP===', resp)
    );
  }

}

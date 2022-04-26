import { Component, OnInit } from '@angular/core';
import { NoteApiService } from '../services/note/note.service';

@Component({
  selector: 'app-notes-page',
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss']
})
export class NotesPageComponent implements OnInit {

  constructor(private noteService: NoteApiService) { }

  ngOnInit(): void {
    this.noteService.getNotes().subscribe(
      resp => console.log('===RESP===', resp)
    );
  }

}

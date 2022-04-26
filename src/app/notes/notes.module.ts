import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesPageComponent } from './page/notes-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesReviewComponent } from './components/notes-review/notes-review.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { MatButtonModule } from '@angular/material/button';
import { NoteSearchComponent } from './components/notes-list/components/note-search/note-search.component';
import { NoteAddComponent } from './components/notes-list/components/note-add/note-add.component';


@NgModule({
  declarations: [
    NotesPageComponent,
    NotesReviewComponent,
    NotesListComponent,
    NoteSearchComponent,
    NoteAddComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class NotesModule { }

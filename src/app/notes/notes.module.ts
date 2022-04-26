import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesPageComponent } from './page/notes-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesReviewComponent } from './components/notes-review/notes-review.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';


@NgModule({
  declarations: [
    NotesPageComponent,
    NotesReviewComponent,
    NotesListComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NotesModule { }

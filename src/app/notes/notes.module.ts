import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesPageComponent } from './page/notes-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesReviewComponent } from './components/notes-review/notes-review.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoteSearchComponent } from './components/notes-list/components/note-search/note-search.component';
import { NoteAddComponent } from './components/notes-list/components/note-add/note-add.component';
import { NoteApiService } from './services/note/note.service';
import { environment } from 'src/environments/environment';
import { NoteApiConfiguration } from './services/note/note-api.model';

export const NOTE_API_CONFIGURATION: InjectionToken<NoteApiConfiguration> = new InjectionToken('Note API configuration');


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
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  providers: [
    {
      provide: NOTE_API_CONFIGURATION,
      useValue: {
        api: environment.DB_API,
        path: 'notes'
      }
    },
    NoteApiService
  ]
})
export class NotesModule { }

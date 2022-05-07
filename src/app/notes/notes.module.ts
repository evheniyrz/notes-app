import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesPageComponent } from './page/notes-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesReviewComponent } from './components/notes-review/notes-review.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoteSearchComponent } from './components/notes-list/components/note-search/note-search.component';
import { NoteAddComponent } from './components/notes-list/components/note-add/note-add.component';
import { NoteApiService } from './services/note/note.service';
import { environment } from 'src/environments/environment';
import { NoteApiConfiguration } from './services/note/note-api.model';
import { TagsComponent } from './components/notes-list/components/tags/tags.component';
import { MatChipsModule } from '@angular/material/chips';
import { HashtagTextareaComponent } from './components/notes-list/components/hashtag-textarea/hashtag-textarea.component';
import { NotesListComponent } from './components/notes-list/components/note-list/notes-list.component';
import { NotesFilterService } from './components/notes-list/components/note-list/services/note-filter/note-filter.service';

export const NOTE_API_CONFIGURATION: InjectionToken<NoteApiConfiguration> = new InjectionToken('Note API configuration');


@NgModule({
  declarations: [
    NotesPageComponent,
    NotesReviewComponent,
    NotesListComponent,
    NoteSearchComponent,
    NoteAddComponent,
    TagsComponent,
    HashtagTextareaComponent,
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  providers: [
    {
      provide: NOTE_API_CONFIGURATION,
      useValue: {
        api: environment.DB_API,
        path: 'notes'
      }
    },
    NoteApiService,
    NotesFilterService
  ]
})
export class NotesModule { }

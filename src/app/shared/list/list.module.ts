import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListComponent } from './list-component/notes-list.component';



@NgModule({
  declarations: [
    NotesListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NotesListComponent
  ],
  providers: [
  ]
})
export class ListModule { }

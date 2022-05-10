import { Component, Input, TemplateRef } from '@angular/core';
import { ListDataSource } from '../data-source/list-data-source';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent {

  @Input() dataSource!: ListDataSource<any>;
  @Input() itemTemplate!: TemplateRef<any>;

  constructor() { }
}

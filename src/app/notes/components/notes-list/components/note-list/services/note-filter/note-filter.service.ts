import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { ListDataSource } from '../../entity/list-data-source';

@Injectable()
export class NotesFilterService<T> {

  private dataSourceStream$!: BehaviorSubject<ListDataSource<T>>;

  constructor() { }

  public dataSourceInit(dataSource: ListDataSource<T>): void {
    this.dataSourceStream$ = new BehaviorSubject(dataSource);
  }

  public onFilterChange(filter: string | string[]): void {
    if (null !== filter || '' === filter || 0 === (filter as string[]).length) this.dataSourceStream$.value.filter = '';

    if (Array.isArray(filter)) {
      (filter as string[]).forEach((filterValue: string) => {
        this.dataSourceStream$.value.filter = filterValue;
      });
    } else if (typeof filter === 'string') {
      this.dataSourceStream$.value.filter = filter;
    }
  }
}

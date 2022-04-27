import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { SearchValuesState } from '../../models/searc.model';

@Component({
  selector: 'app-note-search',
  templateUrl: './note-search.component.html',
  styleUrls: ['./note-search.component.scss']
})
export class NoteSearchComponent implements OnInit, OnDestroy {

  @Output() onSearch: EventEmitter<SearchValuesState> = new EventEmitter();

  public searchControl: FormControl = new FormControl();

  private onDestroy$: Subject<void> = new Subject();
  constructor() { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((value: string) => {
        this.onSearch.next({ text: [value.trim()] });
      }),
      takeUntil(this.onDestroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

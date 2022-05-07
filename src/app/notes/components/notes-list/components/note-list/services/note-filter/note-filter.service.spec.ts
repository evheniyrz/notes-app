import { TestBed } from '@angular/core/testing';

import { NotesFilterService } from './note-filter.service';

describe('NotesFilterService', () => {
  let service: NotesFilterService<{}>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesReviewComponent } from './notes-review.component';

describe('NotesReviewComponent', () => {
  let component: NotesReviewComponent;
  let fixture: ComponentFixture<NotesReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

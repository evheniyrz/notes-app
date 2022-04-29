import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagTextareaComponent } from './hashtag-textarea.component';

describe('HashtagTextareaComponent', () => {
  let component: HashtagTextareaComponent;
  let fixture: ComponentFixture<HashtagTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashtagTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

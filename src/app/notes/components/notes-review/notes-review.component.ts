import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-notes-review',
  templateUrl: './notes-review.component.html',
  styleUrls: ['./notes-review.component.scss']
})
export class NotesReviewComponent implements OnInit {
  @ViewChild('substrate', { static: true }) substrateContainer!: ElementRef;

  public textAreaControl!: FormControl;
  public titleAreaControl!: FormControl;

  private hashtagsRegex = /(^|\W)((#[a-z\d][\w-]*)|(#[а-яё\d-]+))/gi;
  private hashTags: Set<string> = new Set();

  constructor(private fb: FormBuilder) {
    this.textAreaControl = this.fb.control('', { validators: Validators.required, updateOn: 'blur' });
    this.titleAreaControl = this.fb.control('', { validators: Validators.required, updateOn: 'blur' });
  }

  ngOnInit(): void {
    this.textAreaControl.valueChanges
      .pipe(
        tap((value: string) => {
          this.substrateContainer.nativeElement.innerHTML =
            this.highlightHashTags(value);
          const hashTags = value.match(this.hashtagsRegex);
          console.log('HASH', hashTags);
        })
      )
      .subscribe();
  }

  public scroll(event: Event): void {
    if (null != event) {
      this.substrateContainer.nativeElement.scrollTop =
        (event.target as HTMLTextAreaElement)?.scrollTop;
    }
  }

  private highlightHashTags(text: string): string {
    return text.replace(this.hashtagsRegex, '$1<mark>$2</mark>');
  }

}

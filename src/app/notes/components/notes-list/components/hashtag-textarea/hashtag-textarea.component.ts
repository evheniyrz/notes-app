import { Component, ElementRef, EventEmitter, forwardRef, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const HASHTAG_TEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HashtagTextareaComponent),
  multi: true,
};

@Component({
  selector: 'app-hashtag-textarea',
  templateUrl: './hashtag-textarea.component.html',
  styleUrls: ['./hashtag-textarea.component.scss'],
  providers: [HASHTAG_TEXTAREA_VALUE_ACCESSOR]
})
export class HashtagTextareaComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @ViewChild('textarea', { static: true }) textarea!: ElementRef;
  @ViewChild('substrate', { static: true }) substrateContainer!: ElementRef;

  @Output() blurChange: EventEmitter<void> = new EventEmitter();
  @Output() focusChange: EventEmitter<void> = new EventEmitter();
  onChange!: Function;
  onTouched!: Function;

  private hashtagsRegex = /(^|\W)((#[a-z\d][\w-]*)|(#[а-яё\d-]+))/gi;

  constructor(private renderer: Renderer2) { }
  writeValue(value: any): void {
    const div = this.textarea.nativeElement;
    this.renderer.setProperty(div, 'innerHTML', value);
    this.substrateContainer.nativeElement.innerHTML = this.highlightHashTags(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const div = this.textarea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.renderer[action](div, 'disabled');
  }

  public onBlur(): void {
    this.blurChange.next();
  }

  public onFocus(): void {
    this.focusChange.next();
  }

  public change(event: Event) {
    // Angular does not know that the value has changed
    // from our component, so we need to update her with the new value.
    //take the value "innerHTML" to keep the formatting of the content
    if (null != event) {
      this.onChange((event?.target as HTMLDivElement).innerHTML);
      this.onTouched((event?.target as HTMLDivElement).innerHTML);

      this.substrateContainer.nativeElement.innerHTML = this.highlightHashTags(
        (event?.target as HTMLDivElement).innerHTML
      );
    }
  }

  public scroll(event: Event): void {
    if (null != event) {
      this.substrateContainer.nativeElement.scrollTop =
        (event.target as HTMLDivElement)?.scrollTop;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.blurChange.unsubscribe();
  }

  private highlightHashTags(text: string | null): string {
    if (null != text) {
      return text.replace(this.hashtagsRegex, '$1<mark>$2</mark>').replace(/(?:\ r\n|\r|\n)/g, '<br>');
    } else {
      return '';
    }
  }
}

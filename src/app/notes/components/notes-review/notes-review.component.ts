import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, concatMap, defer, EMPTY, iif, of, Subject, takeUntil, tap } from 'rxjs';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';
import { NoteApiService } from '../../services/note/note.service';

@Component({
  selector: 'app-notes-review',
  templateUrl: './notes-review.component.html',
  styleUrls: ['./notes-review.component.scss']
})
export class NotesReviewComponent implements OnInit, OnDestroy {
  @ViewChild('substrate', { static: true }) substrateContainer!: ElementRef;

  public textAreaControl!: FormControl;
  public titleAreaControl!: FormControl;

  private hashtagsRegex = /(^|\W)((#[a-z\d][\w-]*)|(#[а-яё\d-]+))/gi;
  private hashTags: Set<string> = new Set();

  private noteId!: string;
  private currentNote!: Note;

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: NoteApiService,
    private wsService: WebSocketService) {
    this.textAreaControl = this.fb.control('', { validators: Validators.required });
    this.titleAreaControl = this.fb.control('', { validators: Validators.required, updateOn: 'blur' });
  }

  ngOnInit(): void {
    this.titleAreaControl.valueChanges.pipe(
      tap((value: string) => {
        if (this.titleAreaControl.valid && value.trim().length > 0) {

          const payload: Note = {
            ...this.currentNote,
            title: value,
            updateAt: Date.now()
          };

          this.updateNote(payload);
        }
      }),
      takeUntil(this.onDestroy$)
    ).subscribe();

    this.textAreaControl.valueChanges
      .pipe(
        tap((value: string) => {
          this.substrateContainer.nativeElement.innerHTML = this.highlightHashTags(value);
        }),
        takeUntil(this.onDestroy$)
      ).subscribe();

    this.activatedRoute.params.pipe(
      concatMap((params: Params) => {
        this.noteId = params['id'];

        return iif(
          () => null != this.noteId,
          defer(() => this.service.getNote(this.noteId).pipe(
            tap((response: Note) => {
              this.currentNote = response;
              this.titleAreaControl.patchValue(response.title, { emitEvent: false });
              this.textAreaControl.patchValue(response.content, { emitEvent: true });
            }),
            catchError(() => of({}))
          )),
          defer(() => EMPTY)
        );
      }),
      takeUntil(this.onDestroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public scroll(event: Event): void {
    if (null != event) {
      this.substrateContainer.nativeElement.scrollTop =
        (event.target as HTMLTextAreaElement)?.scrollTop;
    }
  }

  public updateNoteContent(): void {
    if (null != this.textAreaControl && this.textAreaControl.valid && (this.textAreaControl.value as string).trim().length > 0) {
      const content: string = this.textAreaControl.value;
      const tags: string[] = content.match(this.hashtagsRegex)?.map((tag: string) => tag.trim()) as string[];

      const payload: Note = {
        ...this.currentNote,
        content,
        tags,
        updateAt: Date.now()
      };

      this.updateNote(payload);
    }
  }

  private highlightHashTags(text: string): string {
    return text.replace(this.hashtagsRegex, '$1<mark>$2</mark>');
  }

  private updateNote(payload: Note): void {
    this.service.updateNote(payload).pipe(
      concatMap(() => {
        return this.service.getNotes().pipe((
          tap((response: Note[]) => this.wsService.send(WS_NOTE_EVENTS.SEND.UPDATE_DATA, response))
        ))
      })
    ).subscribe();
  }

}

import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoteApiService } from 'src/app/notes/services/note/note.service';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { MakeId } from 'makeid';
import { concatMap, Subject, takeUntil, tap } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit, OnDestroy {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  public noteForm: FormGroup;

  private dialogRef!: MatDialogRef<any>;
  private hashtagsRegex = /(^|\W)((#[a-z\d][\w-]*)|(#[а-яё\d-]+))/gi;

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private service: NoteApiService,
    private makeId: MakeId,
    private wsService: WebSocketService) {
    this.noteForm = this.fb.group({
      noteTitle: this.fb.control('', { validators: Validators.required, updateOn: 'submit' }),
      noteText: this.fb.control('', { validators: Validators.required })
    });
  }

  get noteTitleControl(): FormControl {
    return this.noteForm.get('noteTitle') as FormControl;
  }

  get noteTextControl(): FormControl {
    return this.noteForm.get('noteText') as FormControl;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public openDialog(): void {
    this.dialogRef = this.dialog.open(
      this.dialogTemplate,
      {
        width: '50%',
        minWidth: '280px'
      });
  }

  public onSubmit(): void {
    if (this.noteForm.valid) {
      const notePayload: Note = {
        id: this.makeId.uuid(),
        title: this.noteTitleControl.value,
        content: this.noteTextControl.value,
        tags: this.getNoteTags(this.noteTextControl.value),
        updateAt: Date.now()
      };

      this.service.createNote(notePayload).pipe(
        concatMap(() => {
          return this.service.getNotes().pipe((
            tap((response: Note[]) => {
              this.wsService.send(WS_NOTE_EVENTS.SEND.UPDATE_DATA, response);
              this.noteForm.reset(
                {
                  noteTitle: '',
                  noteText: ''
                }
              );
            })
          ))
        })
      ).subscribe(
        {
          next: () => this.dialogRef.close(),
          error: () => this.dialogRef.close()
        }
      );
    }
  }

  private getNoteTags(text: string): string[] {
    return (text.match(this.hashtagsRegex) as string[]).map((tag: string) => tag.trim());
  }

}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoteApiService } from 'src/app/notes/services/note/note.service';
import { Note } from 'src/app/services/in-memory-db/models/note.model';
import { MakeId } from 'makeid';
import { concatMap, tap } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { WS_NOTE_EVENTS } from 'src/app/services/web-socket/ws-note-events';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit {

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  public noteForm: FormGroup;

  private dialogRef!: MatDialogRef<any>;
  private hashtagsRegex = /(^|\W)((#[a-z\d][\w-]*)|(#[а-яё\d-]+))/gi;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private service: NoteApiService,
    private makeId: MakeId,
    private wsService: WebSocketService) {
    this.noteForm = this.fb.group({
      noteTitle: this.fb.control('', { validators: Validators.required, updateOn: 'submit' }),
      noteText: this.fb.control('', { validators: Validators.required, updateOn: 'submit' })
    });
  }

  get noteTitleControl(): FormControl {
    return this.noteForm.get('noteTitle') as FormControl;
  }

  get noteTextControl(): FormControl {
    return this.noteForm.get('noteText') as FormControl;
  }

  ngOnInit(): void {
    console.log(this.noteTitleControl,
      this.noteTextControl);
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
            tap((response: Note[]) => this.wsService.send(WS_NOTE_EVENTS.SEND.UPDATE_DATA, response))
          ))
        })
      ).subscribe(
        {
          next: () => this.dialogRef.close(),
          error: () => this.dialogRef.close(),
          complete: () => console.log('COMPLETE')
        }
      );
    }
  }

  private getNoteTags(text: string): string[] {
    return (text.match(this.hashtagsRegex) as string[]).map((tag: string) => tag.trim());
  }
}

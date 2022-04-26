import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Note } from './models/note.model';

@Injectable()
export class DbService implements InMemoryDbService {

  constructor() { }

  createDb() {

    const notes: Note[] = [];

    return { notes };
  }
}

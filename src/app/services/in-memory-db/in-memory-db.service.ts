import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Note } from './models/note.model';

@Injectable()
export class DbService implements InMemoryDbService {

  constructor() { }

  createDb() {

    const notes: Note[] = [
      {
        "id": "01f9f55b-d24f-4f419-b5ce-c051a2412f0b",
        "title": "New note",
        "content": "#NewHashTAg with longer text and #newOneTag",
        "tags": [
          "#NewHashTAg",
          "#newOneTag"
        ],
        "updateAt": 1651937508614
      },
      {
        "id": "f5a4155e-e0fe-4b4d2-a9f2-697f24d75b39",
        "title": "Angular",
        "content": "#tag and #tag2",
        "tags": [
          "#tag",
          "#tag2"
        ],
        "updateAt": 1651937472402
      }
    ];

    return { notes };
  }
}

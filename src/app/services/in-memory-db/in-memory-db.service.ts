import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Note } from './models/note.model';

@Injectable()
export class DbService implements InMemoryDbService {

  constructor() { }

  createDb() {

    const notes: Note[] = [
      {
        "id": "d09722ed-014b-4dba3-bc1e-265a401cd210",
        "title": "Test navigation",
        "content": "Tag #tag1 #tag2 ",
        "tags": [
          "#tag1",
          "#tag2"
        ],
        "updateAt": 1651050543805
      },
      {
        "id": "ea7bb316-37a0-4b229-a3a8-65b1aa6a6cba",
        "title": "Test filtering",
        "content": "added new tags #repatriant #future and more and more new tags #tag567",
        "tags": [
          "#repatriant",
          "#future",
          "#tag567"
        ],
        "updateAt": 1651057072436
      }
    ];

    return { notes };
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesReviewComponent } from './components/notes-review/notes-review.component';
import { NotesPageComponent } from './page/notes-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'notes',
    component: NotesPageComponent,
    children: [
      {
        path: ':id',
        component: NotesReviewComponent,
        outlet: 'notereview'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }

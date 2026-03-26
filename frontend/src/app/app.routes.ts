import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'boards',
    pathMatch: 'full',
  },
  {
    path: 'boards',
    loadComponent: () =>
      import('./features/board-list/board-list.component')
        .then(m => m.BoardListComponent),
  },
  {
    path: 'boards/:id',
    loadComponent: () =>
      import('./features/board-detail/board-detail.component')
        .then(m => m.BoardDetailComponent),
  },
  {
    path: 'boards/:id/tasks/new',
    loadComponent: () =>
      import('./features/task-form/task-form.component')
        .then(m => m.TaskFormComponent),
  },
  {
    path: 'boards/:id/tasks/:taskId/edit',
    loadComponent: () =>
      import('./features/task-form/task-form.component')
        .then(m => m.TaskFormComponent),
  },
  {
    path: '**',
    redirectTo: 'boards',
  },
];

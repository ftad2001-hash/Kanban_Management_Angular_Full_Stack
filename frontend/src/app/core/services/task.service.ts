import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Task, TaskCreateDTO, TaskUpdateDTO } from '../../models/board.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http   = inject(HttpClient);
  private toast  = inject(ToastService);
  private apiUrl = environment.apiUrl;

  createTask(dto: TaskCreateDTO): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, dto).pipe(
      catchError(err => {
        const msg = err?.error?.message ?? 'Failed to create task';
        this.toast.error(msg);
        return throwError(() => err);
      })
    );
  }

  updateTask(id: number, dto: TaskUpdateDTO): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, dto).pipe(
      catchError(err => {
        const msg = err?.error?.message ?? 'Failed to update task';
        this.toast.error(msg);
        return throwError(() => err);
      })
    );
  }

  moveTask(taskId: number, columnId: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}/move`, { columnId }).pipe(
      catchError(err => {
        this.toast.error('Failed to move task');
        return throwError(() => err);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`).pipe(
      catchError(err => {
        this.toast.error('Failed to delete task');
        return throwError(() => err);
      })
    );
  }
}

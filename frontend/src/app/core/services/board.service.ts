import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Board, BoardDetail } from '../../models/board.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private http       = inject(HttpClient);
  private toast      = inject(ToastService);
  private apiUrl     = `${environment.apiUrl}/boards`;

  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl).pipe(
      catchError(err => {
        this.toast.error('Failed to load boards');
        return throwError(() => err);
      })
    );
  }

  getBoardById(id: number): Observable<BoardDetail> {
    return this.http.get<BoardDetail>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        this.toast.error(`Failed to load board`);
        return throwError(() => err);
      })
    );
  }

  createBoard(name: string): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, { name }).pipe(
      catchError(err => {
        this.toast.error('Failed to create board');
        return throwError(() => err);
      })
    );
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        this.toast.error('Failed to delete board');
        return throwError(() => err);
      })
    );
  }
}

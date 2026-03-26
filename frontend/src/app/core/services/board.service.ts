import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Board, BoardDetail } from '../../models/board.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

const LAST_VISITED_KEY = 'taskflow_last_board_id';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private apiUrl = `${environment.apiUrl}/boards`;

  // Track the last visited board id so the grid can highlight it
  readonly lastVisitedId = signal<number | null>(
    Number(localStorage.getItem(LAST_VISITED_KEY)) || null,
  );

  // ── Read ─────────────────────────────────────────────────────────

  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl).pipe(
      catchError((err) => {
        this.toast.error('Failed to load boards');
        return throwError(() => err);
      }),
    );
  }

  getBoardById(id: number): Observable<BoardDetail> {
    return this.http.get<BoardDetail>(`${this.apiUrl}/${id}`).pipe(
      // Persist last-visited whenever a board is opened
      tap(() => {
        localStorage.setItem(LAST_VISITED_KEY, String(id));
        this.lastVisitedId.set(id);
      }),
      catchError((err) => {
        this.toast.error('Failed to load board');
        return throwError(() => err);
      }),
    );
  }

  // ── Write ─────────────────────────────────────────────────────────

  createBoard(name: string): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, { name }).pipe(
      catchError((err) => {
        this.toast.error('Failed to create board');
        return throwError(() => err);
      }),
    );
  }

  /** PATCH /api/v1/boards/:id  — rename only */
  renameBoard(id: number, name: string): Observable<Board> {
    // The backend PUT /boards/:id currently only accepts { name }
    // If you later add a dedicated PATCH, swap the method here
    return this.http.put<Board>(`${this.apiUrl}/${id}`, { name }).pipe(
      catchError((err) => {
        this.toast.error('Failed to rename board');
        return throwError(() => err);
      }),
    );
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        this.toast.error('Failed to delete board');
        return throwError(() => err);
      }),
    );
  }
}

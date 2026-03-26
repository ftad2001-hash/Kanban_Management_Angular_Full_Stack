import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BoardService } from '../../core/services/board.service';
import { ToastService } from '../../core/services/toast.service';
import { Board } from '../../models/board.model';
import { BoardCardComponent } from './board-card/board-card.component';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, BoardCardComponent],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
})
export class BoardListComponent implements OnInit {
  private boardService = inject(BoardService);
  private toast        = inject(ToastService);
  private router       = inject(Router);
  private fb           = inject(FormBuilder);

  boards   = signal<Board[]>([]);
  loading  = signal(true);
  showForm = signal(false);
  saving   = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  get nameCtrl() { return this.form.get('name')!; }

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.loading.set(true);
    this.boardService.getAllBoards().subscribe({
      next: boards => {
        this.boards.set(boards);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openForm(): void {
    this.form.reset({ name: '' });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
  }

  createBoard(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const name = this.nameCtrl.value!.trim();
    this.boardService.createBoard(name).subscribe({
      next: board => {
        this.toast.success(`Board "${board.name}" created`);
        this.saving.set(false);
        this.showForm.set(false);
        this.router.navigate(['/boards', board.id]);
      },
      error: () => this.saving.set(false),
    });
  }

  deleteBoard(board: Board): void {
    this.boardService.deleteBoard(board.id).subscribe({
      next: () => {
        this.toast.success(`Board "${board.name}" deleted`);
        this.boards.update(list => list.filter(b => b.id !== board.id));
      },
    });
  }
}

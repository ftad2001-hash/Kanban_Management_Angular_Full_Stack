import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  boards = signal<Board[]>([]);
  loading = signal(true);
  showForm = signal(false);
  saving = signal(false);

  // Pull last-visited id from the service signal so the card can be highlighted
  readonly lastVisitedId = computed(() => this.boardService.lastVisitedId());

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  get nameCtrl() {
    return this.form.get('name')!;
  }

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.loading.set(true);
    this.boardService.getAllBoards().subscribe({
      next: (boards) => {
        // Show boards in creation order (API returns them by ID asc by default)
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
      next: (board) => {
        // Add to local list without a full reload
        this.boards.update((list) => [...list, board]);
        this.toast.success(`Board "${board.name}" created`);
        this.saving.set(false);
        this.showForm.set(false);
        this.form.reset();
      },
      error: () => this.saving.set(false),
    });
  }

  deleteBoard(board: Board): void {
    if (!confirm(`Delete board "${board.name}"? This cannot be undone.`))
      return;

    this.boardService.deleteBoard(board.id).subscribe({
      next: () => {
        this.toast.success(`Board "${board.name}" deleted`);
        this.boards.update((list) => list.filter((b) => b.id !== board.id));
      },
    });
  }

  renameBoard(event: { board: Board; newName: string }): void {
    this.boardService.renameBoard(event.board.id, event.newName).subscribe({
      next: (updated) => {
        this.toast.success(`Board renamed to "${updated.name}"`);
        // Update name in local list
        this.boards.update((list) =>
          list.map((b) =>
            b.id === updated.id ? { ...b, name: updated.name } : b,
          ),
        );
      },
    });
  }
}

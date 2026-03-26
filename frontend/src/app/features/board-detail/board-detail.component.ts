import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { BoardService } from '../../core/services/board.service';
import { TaskService } from '../../core/services/task.service';
import { ToastService } from '../../core/services/toast.service';
import { BoardDetail, Column, Task } from '../../models/board.model';
import { ColumnComponent } from './column/column.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [RouterLink, DragDropModule, ColumnComponent],
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.css',
})
export class BoardDetailComponent implements OnInit {
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private boardService = inject(BoardService);
  private taskService  = inject(TaskService);
  private toast        = inject(ToastService);

  board   = signal<BoardDetail | null>(null);
  loading = signal(true);

  get boardId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  get connectedListIds(): string[] {
    return (this.board()?.columns ?? []).map(c => `col-${c.id}`);
  }

  ngOnInit(): void {
    this.loadBoard();
  }

  loadBoard(): void {
    this.loading.set(true);
    this.boardService.getBoardById(this.boardId).subscribe({
      next: board => {
        // Sort columns by position, sort tasks within each column by createdAt
        board.columns.sort((a, b) => a.position - b.position);
        this.board.set(board);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/boards']);
      },
    });
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, targetColumn: Column): void {
    if (event.previousContainer === event.container) {
      // Reorder within same column (visual only — backend has no position on tasks)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    // Move to different column — optimistic update first
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    const task = event.container.data[event.currentIndex];
    this.taskService.moveTask(task.id, targetColumn.id).subscribe({
      next: () => {
        this.toast.success(`Task moved to ${targetColumn.name}`);
      },
      error: () => {
        // Revert optimistic update
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex,
        );
        this.toast.error('Failed to move task — reverted');
      },
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.toast.success('Task deleted');
        // Remove from local state without a full reload
        const b = this.board();
        if (!b) return;
        this.board.set({
          ...b,
          columns: b.columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId),
          })),
        });
      },
    });
  }

  deleteBoard(): void {
    const b = this.board();
    if (!b) return;
    this.boardService.deleteBoard(b.id).subscribe({
      next: () => {
        this.toast.success(`Board "${b.name}" deleted`);
        this.router.navigate(['/boards']);
      },
    });
  }
}

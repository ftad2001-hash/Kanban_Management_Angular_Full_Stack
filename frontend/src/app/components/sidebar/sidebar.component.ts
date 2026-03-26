import { Component, computed, inject, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/task.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private boardService = inject(BoardService);
  private router       = inject(Router);

  readonly boards        = computed(() => this.boardService.boards());
  readonly activeBoardId = computed(() => this.boardService.activeBoardId());

  newBoard = output<void>();

  deleteBoard(event: MouseEvent, board: Board): void {
    event.preventDefault();
    event.stopPropagation();
    const count = board.tasks.length;
    const msg = count
      ? `Delete "${board.name}" and its ${count} task${count !== 1 ? 's' : ''}?`
      : `Delete board "${board.name}"?`;
    if (confirm(msg)) {
      const nextId = this.boardService.deleteBoard(board.id);
      if (nextId) {
        this.router.navigate(['/board', nextId]);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  taskCount(board: Board): number {
    return board.tasks.length;
  }
}

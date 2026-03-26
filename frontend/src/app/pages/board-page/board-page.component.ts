import { Component, computed, inject, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import { KanbanColumnComponent } from '../../components/kanban-column/kanban-column.component';
import { Task, ColumnId, KANBAN_COLUMNS, Board } from '../../models/task.model';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [KanbanColumnComponent, TaskModalComponent],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.css',
})
export class BoardPageComponent implements OnInit {
  private boardService = inject(BoardService);
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);

  readonly taskModal = viewChild.required(TaskModalComponent);
  readonly columns   = KANBAN_COLUMNS;

  board = computed<Board | null>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.boardService.getBoardById(id) : null;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || !this.boardService.getBoardById(id)) {
      this.router.navigate(['/']);
      return;
    }
    this.boardService.setActiveBoard(id);
  }

  tasksForColumn(columnId: ColumnId): Task[] {
    return (this.board()?.tasks ?? []).filter(t => t.column === columnId);
  }

  doneCount(): number {
    return (this.board()?.tasks ?? []).filter(t => t.column === 'done').length;
  }

  openAddTask(columnId: ColumnId): void {
    const b = this.board();
    if (!b) return;
    this.taskModal().open({ boardId: b.id, defaultColumn: columnId });
  }

  openEditTask(task: Task): void {
    const b = this.board();
    if (!b) return;
    this.taskModal().open({ boardId: b.id, editTask: task });
  }

  deleteTask(taskId: string): void {
    const b = this.board();
    if (!b) return;
    this.boardService.deleteTask(b.id, taskId);
  }

  moveTask(event: { taskId: string; column: ColumnId }): void {
    const b = this.board();
    if (!b) return;
    this.boardService.moveTask(b.id, event.taskId, event.column);
  }

  dropTask(event: { taskId: string; fromColumn: ColumnId; toColumn: ColumnId }): void {
    this.moveTask({ taskId: event.taskId, column: event.toColumn });
  }
}

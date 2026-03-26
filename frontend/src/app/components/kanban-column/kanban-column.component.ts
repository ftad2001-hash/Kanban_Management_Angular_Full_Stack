import { Component, input, output, signal } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task, KanbanColumn, ColumnId } from '../../models/task.model';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.css',
})
export class KanbanColumnComponent {
  readonly column     = input.required<KanbanColumn>();
  readonly tasks      = input.required<Task[]>();

  readonly addTask    = output<ColumnId>();
  readonly editTask   = output<Task>();
  readonly deleteTask = output<string>();
  readonly moveTask   = output<{ taskId: string; column: ColumnId }>();
  readonly dropTask   = output<{ taskId: string; fromColumn: ColumnId; toColumn: ColumnId }>();

  isDragOver = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
      this.isDragOver.set(false);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const taskId     = event.dataTransfer!.getData('taskId');
    const fromColumn = event.dataTransfer!.getData('fromColumn') as ColumnId;
    if (taskId) {
      this.dropTask.emit({ taskId, fromColumn, toColumn: this.column().id });
    }
  }
}

import { Component, input, output, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { Task, ColumnId, KANBAN_COLUMNS } from '../../models/task.model';

export interface DueInfo {
  label: string;
  cls: 'overdue' | 'soon' | '';
}

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  readonly task     = input.required<Task>();
  readonly columnId = input.required<ColumnId>();

  readonly edit   = output<Task>();
  readonly delete = output<string>();
  readonly move   = output<{ taskId: string; column: ColumnId }>();

  readonly prevColumn = computed(() => {
    const i = KANBAN_COLUMNS.findIndex(c => c.id === this.columnId());
    return i > 0 ? KANBAN_COLUMNS[i - 1] : null;
  });

  readonly nextColumn = computed(() => {
    const i = KANBAN_COLUMNS.findIndex(c => c.id === this.columnId());
    return i < KANBAN_COLUMNS.length - 1 ? KANBAN_COLUMNS[i + 1] : null;
  });

  readonly dueInfo = computed<DueInfo | null>(() => {
    const d = this.task().dueDate;
    if (!d) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(d + 'T00:00:00');
    const diff = Math.round((due.getTime() - now.getTime()) / 86_400_000);
    if (diff < 0)   return { label: `${Math.abs(diff)}d ago`, cls: 'overdue' };
    if (diff === 0) return { label: 'Today',    cls: 'soon' };
    if (diff === 1) return { label: 'Tomorrow', cls: 'soon' };
    if (diff <= 7)  return { label: `${diff}d`, cls: 'soon' };
    return {
      label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cls: '',
    };
  });

  onDragStart(event: DragEvent): void {
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('taskId', this.task().id);
    event.dataTransfer!.setData('fromColumn', this.columnId());
    (event.currentTarget as HTMLElement).classList.add('dragging');
  }

  onDragEnd(event: DragEvent): void {
    (event.currentTarget as HTMLElement).classList.remove('dragging');
  }

  moveTo(column: ColumnId): void {
    this.move.emit({ taskId: this.task().id, column });
  }
}

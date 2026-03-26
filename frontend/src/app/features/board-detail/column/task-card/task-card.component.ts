import { Component, input, output, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../../../models/board.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  readonly task        = input.required<Task>();
  readonly boardId     = input.required<number>();
  readonly taskDeleted = output<number>();

  readonly dueInfo = computed(() => {
    const d = this.task().dueDate;
    if (!d) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(d + 'T00:00:00');
    const diff = Math.round((due.getTime() - now.getTime()) / 86_400_000);
    const label = diff < 0
      ? `${Math.abs(diff)}d overdue`
      : diff === 0
        ? 'Today'
        : diff === 1
          ? 'Tomorrow'
          : due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { label, overdue: diff < 0, soon: diff >= 0 && diff <= 1 };
  });

  get priorityClass(): string {
    return `priority-${this.task().priority.toLowerCase()}`;
  }
}

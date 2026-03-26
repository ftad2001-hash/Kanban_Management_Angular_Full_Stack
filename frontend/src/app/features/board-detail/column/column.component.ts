import { Component, input, output, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, DragDropModule } from '@angular/cdk/drag-drop';
import { Column, Task } from '../../../models/board.model';
import { TaskCardComponent } from './task-card/task-card.component';

const COL_COLORS: Record<number, { color: string; dim: string }> = {};
const POSITION_COLORS = [
  { color: '#4a7cff', dim: 'rgba(74,124,255,0.15)' },   // position 0: To Do
  { color: '#f4a030', dim: 'rgba(244,160,48,0.15)' },   // position 1: In Progress
  { color: '#50c878', dim: 'rgba(80,200,120,0.15)' },   // position 2: Done
];

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [RouterLink, DragDropModule, CdkDrag, CdkDragPlaceholder, TaskCardComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css',
})
export class ColumnComponent {
  readonly column      = input.required<Column>();
  readonly boardId     = input.required<number>();
  readonly connectedTo = input<string[]>([]);

  readonly taskDropped = output<{ event: CdkDragDrop<Task[]>; column: Column }>();
  readonly taskDeleted = output<number>();

  get dropListId(): string {
    return `col-${this.column().id}`;
  }

  get colColor(): string {
    return POSITION_COLORS[this.column().position]?.color ?? '#9a9690';
  }

  get colDimColor(): string {
    return POSITION_COLORS[this.column().position]?.dim ?? 'rgba(154,150,144,0.15)';
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    this.taskDropped.emit({ event, column: this.column() });
  }
}

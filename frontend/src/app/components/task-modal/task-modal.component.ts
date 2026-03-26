import { Component, inject, model } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BoardService } from '../../services/board.service';
import { ColumnId, Priority, Task } from '../../models/task.model';

export interface TaskModalConfig {
  boardId: string;
  defaultColumn?: ColumnId;
  editTask?: Task;
}

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
  host: { '(keydown.escape)': 'close()' },
})
export class TaskModalComponent {
  private boardService = inject(BoardService);
  private fb           = inject(FormBuilder);

  readonly isOpen = model(false);

  private boardId   = '';
  private editingId: string | null = null;

  form: FormGroup = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(80)]],
    description: ['', Validators.maxLength(500)],
    priority:    ['medium' as Priority, Validators.required],
    dueDate:     [''],
    column:      ['todo' as ColumnId, Validators.required],
  });

  get isEditing(): boolean       { return this.editingId !== null; }
  get titleCtrl(): AbstractControl { return this.form.get('title')!; }

  open(config: TaskModalConfig): void {
    this.boardId   = config.boardId;
    this.editingId = config.editTask?.id ?? null;

    if (config.editTask) {
      const t = config.editTask;
      this.form.setValue({
        title:       t.title,
        description: t.description,
        priority:    t.priority,
        dueDate:     t.dueDate ?? '',
        column:      t.column,
      });
    } else {
      this.form.reset({
        title:       '',
        description: '',
        priority:    'medium',
        dueDate:     '',
        column:      config.defaultColumn ?? 'todo',
      });
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const data = {
      title:       (v.title as string).trim(),
      description: (v.description as string).trim(),
      priority:    v.priority as Priority,
      dueDate:     (v.dueDate as string) || null,
      column:      v.column as ColumnId,
    };

    if (this.editingId) {
      this.boardService.updateTask(this.boardId, this.editingId, data);
    } else {
      this.boardService.addTask(this.boardId, data);
    }

    this.close();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }
}

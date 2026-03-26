import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { BoardService } from '../../core/services/board.service';
import { ToastService } from '../../core/services/toast.service';
import { FlatpickrDirective } from '../../core/directives/flatpickr.directive';
import { Priority, Column } from '../../models/board.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FlatpickrDirective],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private taskService  = inject(TaskService);
  private boardService = inject(BoardService);
  private toast        = inject(ToastService);
  private fb           = inject(FormBuilder);

  boardId  = signal(0);
  taskId   = signal<number | null>(null);
  columns  = signal<Column[]>([]);
  loading  = signal(true);
  saving   = signal(false);

  get isEdit(): boolean { return this.taskId() !== null; }

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    priority:    ['MEDIUM' as Priority, Validators.required],
    dueDate:     [''],
    columnId:    [null as number | null, Validators.required],
  });

  get titleCtrl(): AbstractControl  { return this.form.get('title')!; }
  get columnCtrl(): AbstractControl { return this.form.get('columnId')!; }

  ngOnInit(): void {
    const id       = Number(this.route.snapshot.paramMap.get('id'));
    const taskId   = this.route.snapshot.paramMap.get('taskId');
    const colParam = this.route.snapshot.queryParamMap.get('columnId');

    this.boardId.set(id);
    if (taskId) this.taskId.set(Number(taskId));

    // Load board to get real column IDs
    this.boardService.getBoardById(id).subscribe({
      next: board => {
        const cols = [...board.columns].sort((a, b) => a.position - b.position);
        this.columns.set(cols);
        this.loading.set(false);

        if (this.isEdit) {
          // Task shape is now flat: task.columnId instead of task.column.id
          const task = board.columns
            .flatMap(c => c.tasks)
            .find(t => t.id === this.taskId());

          if (task) {
            this.form.patchValue({
              title:       task.title,
              description: task.description ?? '',
              priority:    task.priority,
              dueDate:     task.dueDate ?? '',
              columnId:    task.columnId,   // ← flat field from TaskResponseDTO
            });
          }
        } else if (colParam) {
          this.form.patchValue({ columnId: Number(colParam) });
        } else {
          this.form.patchValue({ columnId: cols[0]?.id ?? null });
        }
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/boards', id]);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const v = this.form.value;

    if (this.isEdit) {
      this.taskService.updateTask(this.taskId()!, {
        title:       v.title?.trim(),
        description: v.description?.trim() || undefined,
        priority:    v.priority as Priority,
        dueDate:     v.dueDate || null,
      }).subscribe({
        next: () => {
          this.toast.success('Task updated');
          this.saving.set(false);
          this.router.navigate(['/boards', this.boardId()]);
        },
        error: () => this.saving.set(false),
      });
    } else {
      this.taskService.createTask({
        title:       v.title!.trim(),
        description: v.description?.trim() || undefined,
        priority:    v.priority as Priority,
        dueDate:     v.dueDate || null,
        columnId:    v.columnId!,
      }).subscribe({
        next: () => {
          this.toast.success('Task created');
          this.saving.set(false);
          this.router.navigate(['/boards', this.boardId()]);
        },
        error: () => this.saving.set(false),
      });
    }
  }
}

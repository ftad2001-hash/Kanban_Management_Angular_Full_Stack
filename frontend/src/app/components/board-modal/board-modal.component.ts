import { Component, inject, model, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { BOARD_COLORS } from '../../models/task.model';

@Component({
  selector: 'app-board-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './board-modal.component.html',
  styleUrl: './board-modal.component.css',
  host: { '(keydown.escape)': 'close()' },
})
export class BoardModalComponent {
  private boardService = inject(BoardService);
  private router       = inject(Router);
  private fb           = inject(FormBuilder);

  readonly isOpen        = model(false);
  readonly colors        = BOARD_COLORS;
  readonly selectedColor = signal(BOARD_COLORS[0]);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(40)]],
  });

  get nameCtrl() { return this.form.get('name')!; }

  open(): void {
    this.form.reset({ name: '' });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.selectedColor.set(this.boardService.randomBoardColor());
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  pickColor(color: string): void {
    this.selectedColor.set(color);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const name = (this.nameCtrl.value ?? '').trim();
    const board = this.boardService.addBoard(name, this.selectedColor());
    this.close();
    this.router.navigate(['/board', board.id]);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }
}

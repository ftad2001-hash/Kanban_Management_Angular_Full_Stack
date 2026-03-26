import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Board } from '../../../models/board.model';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.css',
})
export class BoardCardComponent {
  readonly board = input.required<Board>();
  readonly isActive = input(false); // highlight last-visited board

  readonly onDelete = output<Board>();
  readonly onRename = output<{ board: Board; newName: string }>();

  // Local UI state for inline rename
  readonly renaming = signal(false);
  readonly renameValue = signal('');

  startRename(): void {
    this.renameValue.set(this.board().name);
    this.renaming.set(true);
  }

  cancelRename(): void {
    this.renaming.set(false);
  }

  submitRename(): void {
    const trimmed = this.renameValue().trim();
    if (!trimmed || trimmed === this.board().name) {
      this.renaming.set(false);
      return;
    }
    this.onRename.emit({ board: this.board(), newName: trimmed });
    this.renaming.set(false);
  }

  // Allow Enter/Escape in the inline input
  handleKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submitRename();
    if (event.key === 'Escape') this.cancelRename();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

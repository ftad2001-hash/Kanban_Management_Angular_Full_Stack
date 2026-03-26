import { Component, input, output } from '@angular/core';
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
  readonly board    = input.required<Board>();
  readonly onDelete = output<Board>();

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }
}

import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private boardService = inject(BoardService);

  readonly boardCount = computed(() => this.boardService.boards().length);
  readonly taskCount  = computed(() => this.boardService.totalTaskCount());
}

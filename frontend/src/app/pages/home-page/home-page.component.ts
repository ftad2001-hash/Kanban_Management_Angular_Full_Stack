import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <div class="home-page">
      <div class="no-board-art">▦</div>
      <div class="no-board-title">No board selected</div>
      <div class="no-board-sub">
        Select a board from the sidebar or create a new one to get started.
      </div>
    </div>
  `,
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private boardService = inject(BoardService);
  private router       = inject(Router);

  ngOnInit(): void {
    // If there are boards, redirect to the last active one automatically
    const active = this.boardService.activeBoard();
    if (active) {
      this.router.navigate(['/board', active.id]);
    }
  }
}

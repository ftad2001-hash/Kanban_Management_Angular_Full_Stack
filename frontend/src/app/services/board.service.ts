import { Injectable, signal, computed } from '@angular/core';
import { AppState, Board, Task, BOARD_COLORS, ColumnId } from '../models/task.model';

const STORAGE_KEY = 'taskflow_v2';

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private state = signal<AppState>(this.loadState());

  readonly boards         = computed(() => this.state().boards);
  readonly activeBoardId  = computed(() => this.state().activeBoardId);
  readonly activeBoard    = computed(() => {
    const id = this.state().activeBoardId;
    return this.state().boards.find(b => b.id === id) ?? null;
  });
  readonly totalTaskCount = computed(() =>
    this.state().boards.reduce((sum, b) => sum + b.tasks.length, 0)
  );

  getBoardById(id: string): Board | null {
    return this.state().boards.find(b => b.id === id) ?? null;
  }

  // ── Persistence ──────────────────────────────────────────────────

  private loadState(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AppState;
    } catch {}
    return this.seedState();
  }

  private saveState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
  }

  private seedState(): AppState {
    const board1: Board = {
      id: genId(), name: 'Product Launch', color: '#c8f060',
      tasks: [
        { id: genId(), title: 'Finalize landing page copy', description: 'Review with marketing team, align on messaging.', priority: 'high', dueDate: offsetDate(2), column: 'todo', createdAt: Date.now() },
        { id: genId(), title: 'Set up analytics tracking', description: 'GA4 events + Mixpanel funnels.', priority: 'medium', dueDate: offsetDate(5), column: 'todo', createdAt: Date.now() },
        { id: genId(), title: 'Write email sequences', description: 'Onboarding, re-engagement, weekly digest.', priority: 'low', dueDate: offsetDate(10), column: 'inprogress', createdAt: Date.now() },
        { id: genId(), title: 'QA the checkout flow', description: 'Test all payment methods on mobile and desktop.', priority: 'high', dueDate: offsetDate(-1), column: 'inprogress', createdAt: Date.now() },
        { id: genId(), title: 'Design system audit', description: 'Remove deprecated tokens, unify spacing scale.', priority: 'medium', dueDate: null, column: 'done', createdAt: Date.now() },
      ],
    };
    const board2: Board = {
      id: genId(), name: 'Engineering Sprint 12', color: '#4a7cff',
      tasks: [
        { id: genId(), title: 'Refactor auth middleware', description: 'Replace legacy JWT handler, add refresh token support.', priority: 'high', dueDate: offsetDate(3), column: 'todo', createdAt: Date.now() },
        { id: genId(), title: 'Write unit tests for API routes', description: 'Target 90% coverage on core endpoints.', priority: 'medium', dueDate: offsetDate(7), column: 'inprogress', createdAt: Date.now() },
        { id: genId(), title: 'Database migration v3→v4', description: 'Run migration script, verify rollback works.', priority: 'high', dueDate: offsetDate(1), column: 'done', createdAt: Date.now() },
      ],
    };
    return { boards: [board1, board2], activeBoardId: board1.id };
  }

  // ── Board Actions ────────────────────────────────────────────────

  setActiveBoard(id: string): void {
    this.state.update(s => ({ ...s, activeBoardId: id }));
    this.saveState();
  }

  addBoard(name: string, color: string): Board {
    const board: Board = { id: genId(), name, color, tasks: [] };
    this.state.update(s => ({
      boards: [...s.boards, board],
      activeBoardId: board.id,
    }));
    this.saveState();
    return board;
  }

  deleteBoard(id: string): string | null {
    let nextId: string | null = null;
    this.state.update(s => {
      const boards = s.boards.filter(b => b.id !== id);
      nextId = s.activeBoardId === id
        ? (boards.length ? boards[boards.length - 1].id : null)
        : s.activeBoardId;
      return { boards, activeBoardId: nextId };
    });
    this.saveState();
    return nextId;
  }

  // ── Task Actions ─────────────────────────────────────────────────

  addTask(boardId: string, taskData: Omit<Task, 'id' | 'createdAt'>): void {
    const task: Task = { id: genId(), createdAt: Date.now(), ...taskData };
    this.state.update(s => ({
      ...s,
      boards: s.boards.map(b =>
        b.id === boardId ? { ...b, tasks: [...b.tasks, task] } : b
      ),
    }));
    this.saveState();
  }

  updateTask(boardId: string, taskId: string, changes: Partial<Task>): void {
    this.state.update(s => ({
      ...s,
      boards: s.boards.map(b =>
        b.id !== boardId ? b : {
          ...b,
          tasks: b.tasks.map(t => t.id === taskId ? { ...t, ...changes } : t),
        }
      ),
    }));
    this.saveState();
  }

  deleteTask(boardId: string, taskId: string): void {
    this.state.update(s => ({
      ...s,
      boards: s.boards.map(b =>
        b.id !== boardId ? b : { ...b, tasks: b.tasks.filter(t => t.id !== taskId) }
      ),
    }));
    this.saveState();
  }

  moveTask(boardId: string, taskId: string, newColumn: ColumnId): void {
    this.updateTask(boardId, taskId, { column: newColumn });
  }

  randomBoardColor(): string {
    return BOARD_COLORS[Math.floor(Math.random() * BOARD_COLORS.length)];
  }
}

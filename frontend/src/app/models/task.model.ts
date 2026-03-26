export type Priority = 'low' | 'medium' | 'high';
export type ColumnId = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  column: ColumnId;
  createdAt: number;
}

export interface Board {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface AppState {
  boards: Board[];
  activeBoardId: string | null;
}

export interface KanbanColumn {
  id: ColumnId;
  label: string;
  color: string;
  dimColor: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'todo',       label: 'To Do',       color: '#4a7cff', dimColor: 'rgba(74,124,255,0.15)' },
  { id: 'inprogress', label: 'In Progress', color: '#f4a030', dimColor: 'rgba(244,160,48,0.15)'  },
  { id: 'done',       label: 'Done',        color: '#50c878', dimColor: 'rgba(80,200,120,0.15)'  },
];

export const BOARD_COLORS: string[] = [
  '#c8f060', '#4a7cff', '#f4a030', '#50c878', '#ff5555',
  '#b67cff', '#40d4f4', '#ff7ca8', '#f0c040', '#60d4a0',
];

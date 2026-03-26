export interface Board {
  id: number;
  name: string;
  createdAt: string;
}

export interface BoardDetail extends Board {
  columns: Column[];
}

export interface Column {
  id: number;
  name: string;
  position: number;
  tasks: Task[];
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  column: { id: number; name: string; position: number };
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateDTO {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
  columnId: number;
}

export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

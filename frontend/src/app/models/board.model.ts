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

/**
 * Matches TaskResponseDTO from the backend.
 * Column info is FLAT (columnId / columnName / columnPosition)
 * instead of a nested object — this prevents the Jackson circular
 * reference that caused the "Unexpected non-whitespace character" error.
 */
export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // "YYYY-MM-DD" or absent

  // Flat column fields (no nested tasks list)
  columnId: number;
  columnName: string;
  columnPosition: number;

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

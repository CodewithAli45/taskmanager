export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  category: string;
  tags: string[];
  createdAt: number;
}

export type SortField = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilters {
  status?: Status | 'all';
  priority?: Priority | 'all';
  category?: string | 'all';
  tags?: string[];
  search?: string;
  startDate?: string;
  endDate?: string;
}

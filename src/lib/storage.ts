import { Task, TaskFilters, SortField, SortOrder } from '../types/task';

const STORAGE_KEY = 'taskflow_tasks';

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  saveTasks([newTask, ...tasks]);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updatedTask = { ...tasks[index], ...updates };
  tasks[index] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  saveTasks(tasks.filter(t => t.id !== id));
};

export const filterAndSortTasks = (
  tasks: Task[],
  filters: TaskFilters,
  sortField: SortField,
  sortOrder: SortOrder
): Task[] => {
  let filtered = [...tasks];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(t => t.status === filters.status);
  }
  
  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter(t => t.priority === filters.priority);
  }
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }
  
  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(s) || 
      t.description.toLowerCase().includes(s) ||
      t.tags.some(tag => tag.toLowerCase().includes(s))
    );
  }

  filtered.sort((a, b) => {
    let comparison = 0;
    if (sortField === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      comparison = priorityWeights[a.priority] - priorityWeights[b.priority];
    } else if (sortField === 'dueDate') {
      comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortField === 'createdAt') {
      comparison = a.createdAt - b.createdAt;
    } else {
      comparison = a.title.localeCompare(b.title);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

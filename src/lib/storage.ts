import { Task, TaskFilters, SortField, SortOrder } from '../types/task';

/**
 * Utility to filter and sort tasks on the client side.
 * We fetch all tasks from MongoDB and then apply filters/sorting here
 * to maintain the exact same behavior as the initial LocalStorage version.
 */
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

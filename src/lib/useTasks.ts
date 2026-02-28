'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFilters, SortField, SortOrder } from '../types/task';
import { getTasks, saveTasks, addTask as apiAddTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, filterAndSortTasks } from './storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    tags: [],
  });
  
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    setTasks(getTasks());
    setLoading(false);
  }, []);

  useEffect(() => {
    const result = filterAndSortTasks(tasks, filters, sortField, sortOrder);
    setFilteredTasks(result);
  }, [tasks, filters, sortField, sortOrder]);

  const refreshTasks = () => setTasks(getTasks());

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = apiAddTask(task);
    refreshTasks();
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = apiUpdateTask(id, updates);
    refreshTasks();
    return updated;
  };

  const deleteTask = (id: string) => {
    apiDeleteTask(id);
    refreshTasks();
  };

  const toggleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { status: task.status === 'todo' ? 'completed' : 'todo' });
    }
  };

  return {
    tasks,
    filteredTasks,
    loading,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
};

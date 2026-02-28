'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFilters, SortField, SortOrder } from '../types/task';
import { filterAndSortTasks } from './storage';

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

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      // Map MongoDB _id to id for frontend compatibility
      const mappedTasks = data.map((t: any) => ({
        ...t,
        id: t._id,
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const result = filterAndSortTasks(tasks, filters, sortField, sortOrder);
    setFilteredTasks(result);
  }, [tasks, filters, sortField, sortOrder]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      const mappedTask = { ...newTask, id: newTask._id };
      setTasks(prev => [mappedTask, ...prev]);
      return mappedTask;
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedTask = await res.json();
      const mappedTask = { ...updatedTask, id: updatedTask._id };
      setTasks(prev => prev.map(t => t.id === id ? mappedTask : t));
      return mappedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
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

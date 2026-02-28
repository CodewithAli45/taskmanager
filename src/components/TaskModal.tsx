'use client';

import { useState, useEffect } from 'react';
import { Task, Priority, Status } from '../types/task';
import { X, Calendar as CalendarIcon, Tag, Plus, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'> | Task) => void;
  initialTask?: Task | null;
}

export const TaskModal = ({ isOpen, onClose, onSave, initialTask }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDueDate(initialTask.dueDate);
      setCategory(initialTask.category);
      setTags(initialTask.tags);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate(new Date().toISOString().split('T')[0]);
      setCategory('Personal');
      setTags([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      priority,
      status,
      dueDate,
      category,
      tags,
    };

    onSave(initialTask ? { ...initialTask, ...taskData } : taskData);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-clip-text text-transparent gradient-bg">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Title</label>
            <input
              autoFocus
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Description</label>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl p-4 min-h-[100px] focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
              placeholder="Add some details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Priority</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none cursor-pointer"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Category</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="Work, Personal, etc."
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Tags</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="Press enter..."
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button 
                  type="button" 
                  onClick={addTag}
                  className="bg-indigo-500 text-white p-4 rounded-2xl transition-transform active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map(tag => (
                <span key={tag} className="bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </form>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="flex-[2] bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
          >
            {initialTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

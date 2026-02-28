'use client';

import { Task } from '../types/task';
import { CheckCircle2, Circle, Clock, MoreVertical, Edit2, Trash2, Tag, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const isCompleted = task.status === 'completed';
  
  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  return (
    <div className={cn(
      "group relative flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300",
      "glass hover:shadow-xl hover:-translate-y-1",
      isCompleted ? "opacity-60 grayscale-[0.5]" : "opacity-100"
    )}>
      <div className="flex items-start justify-between gap-4">
        <button 
          onClick={() => onToggle(task.id)}
          className="mt-1 flex-shrink-0 transition-transform active:scale-90"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-lg font-semibold truncate transition-all",
            isCompleted && "line-through text-slate-500"
          )}>
            {task.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {task.description}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-500 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider",
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>
        
        {task.category && (
          <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            <Tag className="w-3 h-3" />
            {task.category}
          </span>
        )}
        
        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
            <Clock className="w-3 h-3" />
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {task.tags.map(tag => (
            <span key={tag} className="text-[10px] text-cyan-500 dark:text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

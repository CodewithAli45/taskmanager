'use client';

import { TaskFilters, Priority, Status, SortField, SortOrder } from '../types/task';
import { Search, Filter, SortAsc, SortDesc, Calendar, Tag, Shield, ListTodo, CheckCircle } from 'lucide-react';

interface FilterSidebarProps {
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  categories: string[];
}

export const FilterSidebar = ({
  filters,
  setFilters,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  categories
}: FilterSidebarProps) => {
  return (
    <div className="flex flex-col gap-8 p-6 glass rounded-3xl h-fit sticky top-6">
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Search Tasks</h3>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'all', label: 'All', icon: ListTodo },
              { id: 'todo', label: 'Todo', icon: Shield },
              { id: 'completed', label: 'Done', icon: CheckCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilters({ ...filters, status: id as Status | 'all' })}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  filters.status === id 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none translate-y-[-2px]' 
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Priority</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                onClick={() => setFilters({ ...filters, priority: p as Priority | 'all' })}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all border-2 ${
                  filters.priority === p
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10'
                    : 'border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Sorting</h3>
          <div className="flex gap-2">
            <select
              className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
              value={sortField}
              onChange={e => setSortField(e.target.value as SortField)}
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-500 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {['all', ...categories].map(c => (
              <button
                key={c}
                onClick={() => setFilters({ ...filters, category: c })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.category === c
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

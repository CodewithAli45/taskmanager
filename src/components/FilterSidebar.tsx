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
    <div className="flex flex-col gap-8 p-8 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-[2.5rem] h-fit sticky top-8 shadow-sm">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Search Tasks</h3>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-all duration-300" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.25rem] py-4 pl-12 pr-4 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Status</h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'all', label: 'All Tasks', icon: ListTodo },
              { id: 'todo', label: 'To Do', icon: Shield },
              { id: 'completed', label: 'Completed', icon: CheckCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilters({ ...filters, status: id as Status | 'all' })}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  filters.status === id 
                    ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/25 translate-x-1' 
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500'
                    : 'border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Sorting</h3>
          <div className="flex flex-col gap-2">
            <div className="relative group">
              <select
                className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-4 py-4 text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none appearance-none cursor-pointer text-slate-900 dark:text-slate-100"
                value={sortField}
                onChange={e => setSortField(e.target.value as SortField)}
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <SortAsc className="w-4 h-4 opacity-50" />
              </div>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-all active:scale-[0.98]"
            >
              {sortOrder === 'asc' ? (
                <>
                  <SortAsc className="w-4 h-4" />
                  Ascending
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4" />
                  Descending
                </>
              )}
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

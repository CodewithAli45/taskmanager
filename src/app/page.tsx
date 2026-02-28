'use client';

import { useState, useMemo } from 'react';
import { useTasks } from '../lib/useTasks';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { FilterSidebar } from '../components/FilterSidebar';
import { Plus, ListTodo, ChevronLeft, ChevronRight, LayoutGrid, Search, Loader2 } from 'lucide-react';
import { Task } from '../types/task';

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const {
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
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set(filteredTasks.map(t => t.category).filter(Boolean));
    return Array.from(cats);
  }, [filteredTasks]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const handleSaveTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 md:px-8 lg:px-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent gradient-bg tracking-tight">
              TaskFlow Pro
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              You have <span className="text-indigo-500 font-bold">{filteredTasks.filter(t => t.status === 'todo').length}</span> pending tasks today
            </p>
          </div>
          
          <button 
            onClick={handleOpenCreateModal}
            className="group flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-3xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-lg">Create New Task</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              categories={categories}
            />
          </aside>

          {/* Task Grid */}
          <section className="lg:col-span-9 space-y-8">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl border-dashed border-2">
                <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full mb-4">
                  <ListTodo className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">No tasks found</h3>
                <p className="text-slate-400">Try adjusting your filters or create a new task</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {paginatedTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskStatus}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-3 glass rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          currentPage === page 
                            ? 'bg-indigo-500 text-white shadow-lg' 
                            : 'glass text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-3 glass rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </main>
  );
}

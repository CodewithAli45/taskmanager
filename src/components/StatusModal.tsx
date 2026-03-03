'use client';

import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export const StatusModal = ({ isOpen, onClose, type, title, message }: StatusModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        className={cn(
          "bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border animate-in zoom-in duration-300",
          type === 'success' ? 'border-emerald-500/20' : 'border-rose-500/20'
        )}
      >
        <div className="p-8 text-center space-y-4">
          <div className={cn(
            "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-2",
            type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-500 shadow-rose-500/20'
          )}>
            {type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>
          
          <div className="space-y-2">
            <h2 className={cn(
              "text-xl font-black tracking-tight",
              type === 'success' ? 'text-emerald-500' : 'text-rose-500'
            )}>
              {title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className={cn(
              "w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg",
              type === 'success'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25'
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

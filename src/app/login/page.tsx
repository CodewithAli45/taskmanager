'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, User as UserIcon } from 'lucide-react';

import { StatusModal } from '@/components/StatusModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });

  const { login } = useAuth();

  const showError = (title: string, message: string) => {
    setModal({ isOpen: true, type: 'error', title, message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return showError('Missing Email', 'Please enter your email address to sign in.');
    if (!password) return showError('Missing Password', 'Please enter your account password.');

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
      } else {
        showError('Access Denied', data.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      showError('Connection Error', 'We couldn\'t reach the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <StatusModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6">
            <UserIcon className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-all duration-300" />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Password</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 hover:text-cyan-400 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-all duration-300" />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-cyan-500 font-bold hover:text-cyan-400 transition-colors underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

type Step = 'registration' | 'verification';

import { StatusModal } from '@/components/StatusModal';

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('registration');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal states
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

  const router = useRouter();

  const showError = (title: string, message: string) => {
    setModal({ isOpen: true, type: 'error', title, message });
  };

  const showSuccess = (title: string, message: string) => {
    setModal({ isOpen: true, type: 'success', title, message });
  };

  const handleRegisterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Detailed Validation
    if (!formData.name.trim()) return showError('Missing Name', 'Please enter your full name to continue.');
    if (!formData.email.trim()) return showError('Missing Email', 'Email address is required for registration.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return showError('Invalid Email', 'Please provide a valid email address.');
    if (!formData.password) return showError('Missing Password', 'Please create a password for your account.');
    if (formData.password.length < 6) return showError('Weak Password', 'Password must be at least 6 characters long.');
    if (formData.password !== formData.confirmPassword) return showError('Password Mismatch', 'The passwords you entered do not match.');

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess('Registration Successful', 'Your account has been created. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        showError('Registration Failed', data.error || 'Something went wrong during registration.');
      }
    } catch (err) {
      showError('Connection Error', 'Could not connect to the server. Please try again later.');
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
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Join our community today
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-all duration-300" />
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Ali Murtaza"
                  value={formData.name}
                  onChange={handleRegisterInput}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-all duration-300" />
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleRegisterInput}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-all duration-300" />
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl py-4 pl-10 pr-4 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleRegisterInput}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Confirm</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-all duration-300" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl py-4 pl-10 pr-4 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleRegisterInput}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Already registered?{" "}
            <Link href="/login" className="text-cyan-500 font-bold hover:text-cyan-400 transition-colors underline underline-offset-4">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

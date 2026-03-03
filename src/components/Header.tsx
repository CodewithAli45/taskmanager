'use client';

import Link from "next/link";
import { CheckCircle, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <CheckCircle className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">TASK<span className="text-cyan-500">MANAGER</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Ali Murtaza</p>
          </div>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}

function UserMenu() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />;

  if (!user) {
    return (
      <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-widest">
        <UserIcon className="w-4 h-4" />
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <UserIcon className="w-4 h-4 text-cyan-500" />
        <span className="text-sm font-bold text-cyan-500">{user.name}</span>
      </div>
      <button 
        onClick={logout}
        className="p-2 rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all shadow-lg"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

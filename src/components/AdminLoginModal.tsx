import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { getSupabase, setAdminPassword } from '../lib/supabase';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);

    // 사용자가 요청한 비밀번호 체크
    if (password === '!wkfehlsdkemf08!') {
      setAdminPassword(password);
      onSuccess();
    } else {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border-slate-200 dark:border-slate-800"
      >
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access</h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 hover:bg-brand hover:text-white rounded-2xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Admin Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <Lock className="w-5 h-5" />
                Authenticate
              </>
            )}
          </button>
          
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Restricted Access Area
          </p>
        </form>
      </motion.div>
    </div>
  );
}

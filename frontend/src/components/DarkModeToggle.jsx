import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function DarkModeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aruviai-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('aruviai-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('aruviai-theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
        isDark
          ? 'bg-slate-800 text-amber-400 border border-slate-700 hover:bg-slate-700'
          : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'
      } ${className}`}
      aria-label="Toggle dark mode"
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </button>
  );
}

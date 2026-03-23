import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Dna, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Diagnostics', path: '/diagnostics' },
    { label: 'Analytics', path: '/analytics' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-glow">
            <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight font-display">AruviAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard" className="px-5 py-2 gradient-brand text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider shadow-glow hover:opacity-90 transition-all">
            Launch Platform
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-card border-b border-border p-6 space-y-3">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname === link.path ? 'bg-teal-50 text-primary' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;

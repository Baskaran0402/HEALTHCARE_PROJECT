import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Home, ArrowLeft, Search, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'var(--mesh-gradient)' }}
        />
        <div className="absolute top-[-25%] right-[-15%] w-[800px] h-[800px] rounded-full blur-[120px] bg-teal-500/10" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] bg-blue-500/5" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Error code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center shadow-glow">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="font-mono text-[10rem] md:text-[14rem] font-black text-slate-100 leading-none tracking-tighter select-none">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full">
            <Compass size={14} className="text-teal-600" />
            <span className="text-[10px] font-black text-teal-700 uppercase tracking-[0.2em]">
              Node Not Found
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display tracking-tight">
            This diagnostic pathway{' '}
            <span className="text-teal-600 italic">doesn't exist.</span>
          </h2>

          <p className="text-lg text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            The page you're looking for may have been moved, deleted,
            or is currently undergoing maintenance.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 gradient-brand text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-glow hover:opacity-90 transition-all"
          >
            <Home size={18} />
            Return Home
          </Link>
          <Link
            to="/consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-sm uppercase tracking-widest hover:border-slate-400 transition-all"
          >
            <Search size={18} />
            Start Assessment
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { label: 'Dashboard', path: '/aruviai-dashboard' },
            { label: 'Diagnostics', path: '/diagnostics' },
            { label: 'Find Doctors', path: '/find-doctors' },
            { label: 'Contact', path: '/contact' },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-xs font-bold text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default NotFoundPage;

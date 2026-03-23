import { motion } from 'framer-motion';

export function GlassInput({
  type = 'text',
  placeholder,
  icon,
  error,
  className = '',
  label,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors duration-300">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-5 py-4 ${icon ? 'pl-12' : ''}
            rounded-2xl backdrop-blur-xl bg-white/[0.03]
            border ${error ? 'border-red-500/50' : 'border-white/5'}
            text-white placeholder-white/20
            text-sm font-medium tracking-tight
            hover:bg-white/[0.05] hover:border-white/10
            focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-0
            outline-none transition-all duration-500
          `}
          {...props}
        />

        {/* Dynamic Glow Effect */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 blur-sm -z-10 transition-opacity duration-500" />
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-1 text-[10px] font-bold uppercase tracking-widest text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}

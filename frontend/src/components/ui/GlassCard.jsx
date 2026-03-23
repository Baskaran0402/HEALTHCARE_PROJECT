import { motion } from 'framer-motion';

export function GlassCard({
  children,
  variant = 'default',
  glow = false,
  padding = 'md',
  rounded = '2xl',
  className = ''
}) {
  const baseStyles = 'backdrop-blur-xl bg-white/5 border border-white/10';
  
  const variants = {
    default: '',
    elevated: 'shadow-2xl',
    interactive: 'cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300'
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const roundings = {
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-3xl',
    '3xl': 'rounded-3xl'
  };

  return (
    <motion.div
      whileHover={variant === 'interactive' ? { y: -4, scale: 1.02 } : {}}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${roundings[rounded]}
        ${className}
        relative group
      `}
    >
      {children}
      
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 
                        rounded-inherit opacity-0 group-hover:opacity-20 blur-xl -z-10
                        transition-opacity duration-300" />
      )}
    </motion.div>
  );
}

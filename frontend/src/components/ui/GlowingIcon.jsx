import { motion } from 'framer-motion';

export function GlowingIcon({ children, color = 'purple', className = '' }) {
  const colors = {
    purple: '#667eea',
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    yellow: '#f59e0b',
    white: '#ffffff'
  };

  const selectedColor = colors[color] || colors.purple;

  return (
    <motion.div
      animate={{
        filter: [
          `drop-shadow(0 0 10px ${selectedColor}80)`,
          `drop-shadow(0 0 20px ${selectedColor}CC)`,
          `drop-shadow(0 0 10px ${selectedColor}80)`
        ]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`text-4xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

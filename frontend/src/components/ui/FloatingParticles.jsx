/* eslint-disable react-hooks/purity */
import React from 'react';

import { motion } from 'framer-motion';

export function FloatingParticles({ count = 30 }) {
  // Use a fixed width/height for estimation since window might not be available consistently on server/during hydration
  // but in Vite it's client-side mostly.
  const particles = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 10 + 20
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          initial={{
            x: p.x,
            y: p.y,
            opacity: p.opacity
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

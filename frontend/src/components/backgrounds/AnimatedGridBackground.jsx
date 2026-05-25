import { motion } from 'framer-motion'

export function AnimatedGridBackground({ className = '', cellSize = 60 }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
        animate={{ backgroundPosition: ['0px 0px', `${cellSize}px ${cellSize}px`] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, var(--color-background) 75%)',
        }}
      />
    </div>
  )
}

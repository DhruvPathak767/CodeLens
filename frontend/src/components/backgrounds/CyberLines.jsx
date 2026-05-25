import { motion } from 'framer-motion'

export function CyberLines({ className = '' }) {
  const lines = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    top: `${15 + i * 14}%`,
    delay: i * 0.8,
    duration: 4 + i * 0.5,
  }))

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute left-0 h-px w-full"
          style={{
            top: line.top,
            background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.15), transparent)',
          }}
          animate={{ opacity: [0, 0.6, 0], scaleX: [0.3, 1, 0.3] }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: line.delay,
          }}
        />
      ))}
    </div>
  )
}

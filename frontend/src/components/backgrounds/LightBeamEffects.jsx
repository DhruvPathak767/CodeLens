import { motion } from 'framer-motion'

export function LightBeamEffects({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute -top-1/2 left-[20%] w-px h-[200%] origin-top"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.35), transparent)',
        }}
        animate={{ opacity: [0.2, 0.6, 0.2], rotate: [12, 14, 12], x: [0, 80, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -top-1/2 right-[30%] w-px h-[200%] origin-top"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.3), transparent)',
        }}
        animate={{ opacity: [0.15, 0.45, 0.15], rotate: [-8, -6, -8], x: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 left-0 w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.2), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

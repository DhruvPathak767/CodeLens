import { motion } from 'framer-motion'

export function MeshGradientBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 mesh-gradient overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full blur-[120px]"
        style={{ background: 'rgba(34, 211, 238, 0.12)' }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full blur-[100px]"
        style={{ background: 'rgba(168, 85, 247, 0.1)' }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[40%] h-[40%] rounded-full blur-[80px]"
        style={{ background: 'rgba(6, 182, 212, 0.08)' }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

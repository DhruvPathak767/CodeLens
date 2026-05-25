import { motion } from 'framer-motion'

export function LightBeams({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute -top-1/2 left-1/4 w-px h-[200%] bg-gradient-to-b from-transparent via-primary/30 to-transparent rotate-12"
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -top-1/2 right-1/3 w-px h-[200%] bg-gradient-to-b from-transparent via-secondary/25 to-transparent -rotate-6"
        animate={{ opacity: [0.2, 0.5, 0.2], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl" />
    </div>
  )
}

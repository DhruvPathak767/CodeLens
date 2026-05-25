import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export function ScanLineEffect({ className, active = true }) {
  if (!active) return null

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]', className)}>
      <motion.div
        className="absolute inset-x-0 h-[2px] z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), transparent)',
          boxShadow: '0 0 20px rgba(34,211,238,0.6)',
        }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-primary/5"
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

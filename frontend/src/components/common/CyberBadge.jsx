import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export function CyberBadge({ children, className, pulse = false }) {
  return (
    <motion.span
      animate={pulse ? { boxShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 20px rgba(34,211,238,0.3)', '0 0 0 rgba(34,211,238,0)'] } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
        'bg-primary/10 text-primary border border-primary/30 backdrop-blur-sm',
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
      )}
      {children}
    </motion.span>
  )
}

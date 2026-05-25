import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export function GlowButton({ children, className, onClick, disabled, size = 'lg', type = 'button' }) {
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(34, 211, 238, 0.4)' }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'bg-gradient-to-r from-primary via-cyan-400 to-secondary text-primary-foreground',
        'shadow-lg shadow-primary/25 overflow-hidden',
        sizes[size],
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}

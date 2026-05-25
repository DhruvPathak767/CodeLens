import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export function Switch({ checked, onCheckedChange, className, label }) {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <motion.span
          layout
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg"
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ marginTop: 1 }}
        />
      </button>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </label>
  )
}

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export function AnimatedLoader({ size = 'md', text, className }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className={cn('relative', sizes[size])}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}

export function ScanningLoader({ className }) {
  const scanLines = ['Analyzing syntax...', 'Checking security patterns...', 'Evaluating performance...', 'Generating suggestions...']

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-primary/30 bg-card/80 p-8', className)}>
      <motion.div
        className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="space-y-3">
        {scanLines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: [0.3, 1, 0.3], x: 0 }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            className="text-sm font-mono text-primary/80"
          >
            <span className="text-primary mr-2">▸</span>
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  )
}

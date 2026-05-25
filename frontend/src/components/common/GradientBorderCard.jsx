import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { depthCardVariants } from '@/animations/cardVariants'

export function GradientBorderCard({ children, className, depth = true, glow = false }) {
  return (
    <motion.div
      variants={depth ? depthCardVariants : undefined}
      initial="rest"
      whileHover={depth ? 'hover' : undefined}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn(
        'rounded-xl p-[1px] bg-gradient-to-br from-primary/50 via-secondary/30 to-primary/50 w-full max-w-full overflow-hidden',
        glow && 'shadow-lg shadow-primary/10',
        className
      )}
    >
      <div className="rounded-[11px] bg-card/80 backdrop-blur-xl h-full w-full max-w-full overflow-hidden">{children}</div>
    </motion.div>
  )
}

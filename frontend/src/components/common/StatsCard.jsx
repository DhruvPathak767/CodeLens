import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { GradientBorderCard } from './GradientBorderCard'

export function StatsCard({ label, value, icon: Icon, color = 'text-primary', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <GradientBorderCard glow>
        <div className="p-5 flex items-center gap-4">
          <div className={cn('p-3 rounded-xl bg-white/5 border border-white/10', color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <motion.p
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {value}
            </motion.p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </GradientBorderCard>
    </motion.div>
  )
}

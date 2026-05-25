import { motion } from 'framer-motion'
import { GradientBorderCard } from '@/components/common/GradientBorderCard'
import { cn } from '@/utils/cn'

export function RiskScoreCard({ score, critical, warning, suggestion }) {
  const getScoreColor = (s) => {
    if (s >= 85) return 'text-emerald-400'
    if (s >= 70) return 'text-primary'
    if (s >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <GradientBorderCard glow>
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Quality Score</p>
        <motion.p
          className={cn('text-5xl font-bold', getScoreColor(score))}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {score}%
        </motion.p>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <span className="text-red-400">{critical} critical</span>
          <span className="text-amber-400">{warning} warnings</span>
          <span className="text-blue-400">{suggestion} tips</span>
        </div>
      </div>
    </GradientBorderCard>
  )
}

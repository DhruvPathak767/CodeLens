import { motion } from 'framer-motion'
import { FileCode, ArrowRight } from 'lucide-react'
import { GradientBorderCard } from '@/components/common/GradientBorderCard'
import { StatusIndicator } from '@/components/common/StatusIndicator'
import { SeverityBadge } from '@/components/review/SeverityBadge'
import { staggerItem } from '@/animations/staggerVariants'

export function ReviewCard({ review, onClick, index = 0 }) {
  // Safe parsing of backend schema values
  const title = review.projectName || review.title || 'Untitled Scan'
  const score = review.score !== undefined ? review.score : (review.riskScore !== undefined ? Math.max(0, Math.round(100 - review.riskScore)) : 100)
  const results = review.reviewResults || []
  
  const criticalCount = review.summary?.critical !== undefined 
    ? review.summary.critical 
    : results.filter((i) => String(i.severity).toLowerCase() === 'critical').length
    
  const warningCount = review.summary?.warning !== undefined 
    ? review.summary.warning 
    : results.filter((i) => String(i.severity).toLowerCase() === 'warning').length

  const status = review.status || 'completed'

  return (
    <motion.div variants={staggerItem} custom={index}>
      <GradientBorderCard depth glow>
        <motion.button
          type="button"
          onClick={onClick}
          whileHover={{ scale: 1.01 }}
          className="w-full p-5 text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:glow-cyan transition-shadow">
                <FileCode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm group-hover:text-primary transition-colors truncate max-w-[180px]">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{review.language}</p>
              </div>
            </div>
            <StatusIndicator status={status} showLabel={false} />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <SeverityBadge severity="critical" count={criticalCount} />
            <SeverityBadge severity="warning" count={warningCount} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 mr-4">
              <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
              <span className="text-sm font-bold text-primary">{score}%</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </motion.button>
      </GradientBorderCard>
    </motion.div>
  )
}

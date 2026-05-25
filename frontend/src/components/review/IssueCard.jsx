import { motion } from 'framer-motion'
import { AlertCircle, Sparkles } from 'lucide-react'
import { SeverityBadge } from './SeverityBadge'
import { staggerItem } from '@/animations/staggerVariants'
import { cn } from '@/utils/cn'

const severityColors = {
  critical: 'text-red-400 border-red-500/20 bg-red-500/5',
  warning: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
  suggestion: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
}

export function IssueCard({ issue, index = 0 }) {
  const severityLower = String(issue.severity || 'suggestion').toLowerCase()
  const title = issue.title || issue.issue || 'Audit Issue'
  const description = issue.description || issue.explanation || ''
  const suggestion = issue.suggestion || issue.fix || ''
  const fixCode = issue.fix || issue.optimizedCode || ''

  return (
    <motion.div
      variants={staggerItem}
      custom={index}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className={cn(
        'rounded-xl border overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5',
        severityColors[severityLower] || severityColors.suggestion
      )}
    >
      <div className="flex items-start gap-4 p-4 border-b border-white/5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{title}</h4>
            <SeverityBadge severity={severityLower} />
            <span className="text-xs text-muted-foreground font-mono">L{issue.line}</span>
            {issue.confidence && (
              <span className="text-xs text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {issue.confidence}% confidence
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-4 space-y-3 bg-black/20">
        {suggestion && (
          <p className="text-sm">
            <span className="text-primary font-medium">Suggestion: </span>
            <span className="text-muted-foreground">{suggestion}</span>
          </p>
        )}
        {fixCode && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="text-xs text-emerald-400 mb-1 font-medium">Suggested Fix</p>
            <code className="text-xs font-mono text-emerald-300/90 break-all">{fixCode}</code>
          </div>
        )}
      </div>
    </motion.div>
  )
}

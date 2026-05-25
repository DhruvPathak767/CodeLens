import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

const config = {
  critical: { variant: 'critical', label: 'Critical' },
  warning: { variant: 'warning', label: 'Warning' },
  suggestion: { variant: 'suggestion', label: 'Suggestion' },
}

export function SeverityBadge({ severity, count, className }) {
  const c = config[severity] || config.suggestion
  return (
    <Badge variant={c.variant} className={cn(className)}>
      {count !== undefined ? `${count} ${c.label.toLowerCase()}` : c.label}
    </Badge>
  )
}

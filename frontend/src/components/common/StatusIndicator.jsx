import { cn } from '@/utils/cn'

const statusConfig = {
  completed: { color: 'bg-emerald-500', label: 'Completed', pulse: false },
  processing: { color: 'bg-primary', label: 'Processing', pulse: true },
  failed: { color: 'bg-destructive', label: 'Failed', pulse: false },
  pending: { color: 'bg-amber-500', label: 'Pending', pulse: true },
}

export function StatusIndicator({ status = 'completed', showLabel = true, className }) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.color)} />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', config.color)} />
      </span>
      {showLabel && <span className="text-xs text-muted-foreground">{config.label}</span>}
    </div>
  )
}

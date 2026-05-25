import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/20 text-primary border border-primary/30',
        secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
        critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        suggestion: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        outline: 'border border-white/20 text-muted-foreground',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

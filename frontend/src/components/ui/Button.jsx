import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
        secondary: 'bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30',
        outline: 'border border-white/10 bg-transparent hover:bg-white/5 hover:border-primary/30',
        ghost: 'hover:bg-white/5',
        destructive: 'bg-destructive/90 text-white hover:bg-destructive',
        gradient: 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(({ className, variant, size, animated = true, children, ...props }, ref) => {
  const Comp = animated ? motion.button : 'button'
  const motionProps = animated
    ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } }
    : {}

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  )
})

Button.displayName = 'Button'

export { Button, buttonVariants }

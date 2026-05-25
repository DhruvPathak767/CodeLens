import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { buttonVariants } from '@/components/ui/Button'
import { hoverGlow, tapScale } from '@/animations/hoverVariants'

export const AnimatedButton = forwardRef(
  ({ className, variant, size, children, glow = false, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        variants={glow ? hoverGlow : undefined}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        {...tapScale}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

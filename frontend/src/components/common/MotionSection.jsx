import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { fadeInUp } from '@/animations/staggerVariants'

export function MotionSection({ children, className, id, delay = 0 }) {
  return (
    <motion.section
      id={id}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
      className={cn('relative', className)}
    >
      {children}
    </motion.section>
  )
}

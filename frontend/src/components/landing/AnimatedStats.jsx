import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/animations/staggerVariants'
import { AnimatedCounter } from '@/components/common/AnimatedCounter'

const stats = [
  { value: '2M+', label: 'Lines Reviewed' },
  { value: '50K+', label: 'Issues Caught' },
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '<3s', label: 'Avg. Analysis' },
]

export function AnimatedStats() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-white/10"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={staggerItem} className="text-center">
          <motion.p
            className="text-3xl md:text-4xl font-bold text-gradient"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <AnimatedCounter value={stat.value} />
          </motion.p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

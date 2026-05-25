import { motion } from 'framer-motion'
import logo from '@/assets/logo.svg'
import { GradientBorderCard } from '@/components/common/GradientBorderCard'
import { authPageVariants } from '@/animations/pageVariants'
import { APP_NAME } from '@/utils/constants'

export function AuthPanel({ children, title, subtitle, accent = 'cyan' }) {
  const glowClass = accent === 'purple' ? 'glow-purple' : 'glow-cyan'

  return (
    <motion.div variants={authPageVariants} initial="initial" animate="animate" exit="exit">
      <GradientBorderCard glow className={glowClass}>
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold mb-2"
            >
              {title}
            </motion.h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </GradientBorderCard>
    </motion.div>
  )
}

export function AuthBranding() {
  return (
    <div className="hidden lg:flex flex-col justify-center p-12 relative">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 p-1 flex-shrink-0"
          >
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight text-foreground">{APP_NAME}</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 leading-tight">
          The AI Operating System for{' '}
          <span className="text-gradient">Code Quality</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Join engineering teams shipping secure, performant code with confidence.
        </p>
        <div className="space-y-4">
          {['Real-time vulnerability scanning', 'Performance optimization insights', 'Team-wide quality analytics'].map(
            (item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </div>
  )
}

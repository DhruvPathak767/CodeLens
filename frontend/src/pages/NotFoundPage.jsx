import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { CinematicBackground } from '@/components/backgrounds/CinematicBackground'
import { GlowButton } from '@/components/common/GlowButton'
import { Button } from '@/components/ui/Button'
import { FloatingCard } from '@/components/common/FloatingCard'
import { floatSlowVariants } from '@/animations/floatingVariants'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CinematicBackground showCyberLines particleCount={40} />

      <motion.div
        variants={floatSlowVariants}
        animate="animate"
        className="absolute top-20 left-[10%] hidden lg:block"
      >
        <FloatingCard float={false} className="p-4 text-xs font-mono text-primary/50">
          Error: ROUTE_NOT_FOUND
        </FloatingCard>
      </motion.div>

      <motion.div
        variants={floatSlowVariants}
        animate="animate"
        transition={{ delay: 1 }}
        className="absolute bottom-32 right-[10%] hidden lg:block"
      >
        <FloatingCard float={false} className="p-4 text-xs font-mono text-secondary/50">
          status: 404
        </FloatingCard>
      </motion.div>

      <div className="relative z-10 text-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <motion.h1
            className="text-[100px] md:text-[160px] font-bold leading-none text-gradient select-none"
            animate={{ opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            404
          </motion.h1>
          <div className="flex justify-center -mt-12 md:-mt-20 mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="p-5 rounded-2xl glass-strong glow-cyan border border-primary/30"
            >
              <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-mono tracking-wider">SYSTEM ANOMALY DETECTED</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            The requested route doesn&apos;t exist in this dimension. Let&apos;s navigate you back to safety.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <GlowButton onClick={() => navigate('/')}>
              <Home className="h-4 w-4" /> Go Home
            </GlowButton>
            <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
          </div>
        </motion.div>

        <motion.p
          className="mt-16 font-mono text-xs text-muted-foreground/40"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          [ERR_NO_ROUTE] :: navigate(&apos;/&apos;) to recover
        </motion.p>
      </div>
    </div>
  )
}

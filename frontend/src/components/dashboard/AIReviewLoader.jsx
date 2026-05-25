import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLineEffect } from '@/components/common/ScanLineEffect'
import { FloatingParticles } from '@/components/backgrounds/FloatingParticles'
import { cn } from '@/utils/cn'

const STAGE_LABELS = {
  queued: 'Queued',
  analyzing: 'Parsing AST',
  security_scan: 'Security Audit',
  performance_analysis: 'Performance Evaluation',
  scalability_check: 'Scalability Audit',
  generating_fixes: 'Generating Solutions',
  completed: 'Done',
  failed: 'Error'
}

export function AIReviewLoader({ active, progress = 0, currentStage = 'queued', logs = [], className }) {
  const [internalProgress, setInternalProgress] = useState(0)
  const logsEndRef = useRef(null)

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  // Fallback timer if real progress is 0
  useEffect(() => {
    if (!active) {
      setInternalProgress(0)
      return
    }
    if (progress > 0) {
      setInternalProgress(progress)
      return
    }
    const interval = setInterval(() => {
      setInternalProgress((p) => (p >= 95 ? 95 : p + Math.random() * 5))
    }, 500)
    return () => clearInterval(interval)
  }, [active, progress])

  if (!active) return null

  const getStageIndex = (stage) => {
    const stagesOrder = ['queued', 'analyzing', 'security_scan', 'performance_analysis', 'scalability_check', 'generating_fixes', 'completed']
    return stagesOrder.indexOf(stage)
  }

  const currentStageIndex = getStageIndex(currentStage)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={cn(
        'relative rounded-2xl overflow-hidden border border-primary/40 bg-card/90 backdrop-blur-2xl',
        'shadow-2xl shadow-primary/20',
        className
      )}
    >
      <FloatingParticles count={12} className="opacity-60" />
      <ScanLineEffect active />

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn("h-3 w-3 rounded-full", currentStage === 'failed' ? 'bg-destructive' : 'bg-primary')}
              animate={currentStage !== 'failed' ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm font-mono text-primary tracking-wider">
              {currentStage === 'failed' ? 'ANALYSIS FAILED' : 'AI ANALYSIS IN PROGRESS'}
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            Stage: {STAGE_LABELS[currentStage] || currentStage}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-6">
          <motion.div
            className={cn(
              "h-full rounded-full bg-gradient-to-r",
              currentStage === 'failed' 
                ? "from-destructive to-red-500" 
                : "from-primary via-cyan-400 to-secondary"
            )}
            style={{ width: `${internalProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Real-time Logs Console */}
        <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs max-h-[160px] overflow-y-auto custom-scrollbar shadow-inner">
          {logs.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              className="text-primary flex items-center gap-2"
            >
              <span className="text-primary">▸</span>
              Initializing neural processing environment...
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                _
              </motion.span>
            </motion.p>
          ) : (
            logs.map((log, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 0.8 }}
                className={cn(
                  "flex items-center gap-2 py-0.5",
                  log.stage === 'failed' || log.message?.toLowerCase().includes('error') || log.message?.toLowerCase().includes('fail')
                    ? 'text-red-400' 
                    : log.stage === 'completed'
                    ? 'text-emerald-400 font-semibold'
                    : 'text-cyan-400/90'
                )}
              >
                <span className="text-muted-foreground/50">[{new Date(log.timestamp || Date.now()).toLocaleTimeString([], { hour12: false })}]</span>
                <span>✓</span>
                <span>{log.message}</span>
              </motion.p>
            ))
          )}
          <div ref={logsEndRef} />
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { id: 1, label: 'SEC', limit: 2 },
            { id: 2, label: 'PERF', limit: 3 },
            { id: 3, label: 'ARCH', limit: 4 },
            { id: 4, label: 'SCALE', limit: 5 }
          ].map((item, i) => {
            const isCompleted = currentStageIndex >= item.limit || currentStage === 'completed'
            const isActive = currentStageIndex === item.limit - 1
            return (
              <motion.div
                key={item.label}
                className="text-center py-2 rounded-lg bg-white/5 border transition-all duration-300"
                animate={{
                  borderColor: isCompleted 
                    ? 'rgba(34,211,238,0.5)' 
                    : isActive 
                    ? 'rgba(14,165,233,0.5)' 
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: isCompleted 
                    ? '0 0 15px rgba(34,211,238,0.15)' 
                    : isActive 
                    ? '0 0 15px rgba(14,165,233,0.1)' 
                    : 'none',
                }}
              >
                <span className={cn(
                  "text-[10px] font-mono", 
                  isCompleted ? "text-primary font-bold" : isActive ? "text-sky-400" : "text-muted-foreground/60"
                )}>
                  {item.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

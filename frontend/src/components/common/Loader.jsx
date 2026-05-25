import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Cpu, Shield, Database, Check } from 'lucide-react'
import logo from '@/assets/logo.svg'

export function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / 24) + 1
    const yPositions = Array(columns).fill(0)

    const matrixChars = "0101010100101100110101"

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.08)' // Fade trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '12px monospace'

      yPositions.forEach((y, index) => {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
        const x = index * 24

        // Add subtle variations in color opacity to create distance depth
        ctx.fillStyle = `rgba(34, 211, 238, ${Math.random() * 0.12 + 0.03})`
        ctx.fillText(char, x, y)

        if (y > 100 + Math.random() * 10000) {
          yPositions[index] = 0
        } else {
          yPositions[index] = y + 14
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const terminalSteps = [
    { threshold: 10, text: '▸ BOOT: Initializing core neural network...', icon: Cpu },
    { threshold: 30, text: '▸ SECURE: Establishing encrypted handshake...', icon: Shield },
    { threshold: 55, text: '▸ DB: Syncing vulnerability threat signatures...', icon: Database },
    { threshold: 80, text: '▸ SCANNER: Calibration of line-level static analyzers...', icon: Terminal },
    { threshold: 95, text: '▸ STATUS: System online. Neural engines active.', icon: Check, isDone: true },
  ]

  useEffect(() => {
    // Increment progress smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Hold at 100% briefly for visual satisfaction before exiting
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 600)
          return 100
        }
        // Random incremental steps to feel realistic
        const step = Math.floor(Math.random() * 8) + 4
        return Math.min(prev + step, 100)
      })
    }, 120)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    // Add logs dynamically as progress passes thresholds
    terminalSteps.forEach((step) => {
      if (progress >= step.threshold && !logs.some((l) => l.text === step.text)) {
        setLogs((prev) => [...prev, step])
      }
    })
  }, [progress, logs])

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(16px)' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
    >
      {/* Matrix Digital rain canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />

      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Background Glowing Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none animate-pulse" />

      {/* Futuristic Laser Scanner Overlay */}
      <motion.div
        initial={{ y: '-100vh' }}
        animate={{ y: '100vh' }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.6)] pointer-events-none z-10"
      />

      <div className="relative flex flex-col items-center max-w-md w-full px-6 z-20">
        
        {/* Glowing Orb & Interactive Rotating Rings */}
        <div className="relative w-36 h-36 mb-12 flex items-center justify-center">
          {/* Central Pulsating Core */}
          <motion.div
            animate={{
              scale: [0.95, 1.08, 0.95],
              boxShadow: [
                '0 0 25px rgba(34,211,238,0.3)',
                '0 0 45px rgba(168,85,247,0.4)',
                '0 0 25px rgba(34,211,238,0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-cyan-400 to-secondary flex items-center justify-center z-10 p-2.5"
          >
            <img src={logo} alt="Logo" className="h-full w-full object-contain animate-pulse" />
          </motion.div>

          {/* Outer Ring 1: Clockwise */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-primary/40"
          />

          {/* Outer Ring 2: Counter-Clockwise */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border border-dotted border-secondary/30"
          />

          {/* Outer Ring 3: Glow ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -inset-6 rounded-full border border-primary/10 shadow-[0_0_30px_rgba(34,211,238,0.05)]"
          />
        </div>

        {/* Title and Progress Text */}
        <h2 className="text-xl font-bold tracking-wider mb-2 text-foreground font-mono uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Initializing AI System...
        </h2>
        <div className="text-sm font-mono text-primary/80 mb-6 font-bold">{progress}%</div>

        {/* Progress Bar Container */}
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mb-8 relative border border-white/5">
          <motion.div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary via-cyan-400 to-secondary shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />
        </div>

        {/* Terminal logs list */}
        <div className="w-full h-32 bg-card/40 border border-border/40 rounded-xl p-4 font-mono text-[10px] text-muted-foreground/80 overflow-y-auto leading-relaxed flex flex-col gap-2 shadow-inner">
          <AnimatePresence>
            {logs.map((log, index) => {
              const Icon = log.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2"
                >
                  <Icon className={`h-3 w-3 shrink-0 ${log.isDone ? 'text-emerald-500' : 'text-primary/70'}`} />
                  <span className={log.isDone ? 'text-emerald-400 font-bold' : ''}>{log.text}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  )
}

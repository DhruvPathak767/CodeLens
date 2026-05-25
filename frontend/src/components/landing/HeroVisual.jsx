import { motion } from 'framer-motion'
import { CheckCircle2, ShieldAlert, Cpu, Activity, Server } from 'lucide-react'
import { PerspectiveContainer } from '@/components/common/ParallaxContainer'
import { GradientBorderCard } from '@/components/common/GradientBorderCard'
import { CodeBlock } from '@/components/common/CodeBlock'
import { ScanLineEffect } from '@/components/common/ScanLineEffect'
import { FloatingCard } from '@/components/common/FloatingCard'
import { ThreeDOrb } from '@/components/common/ThreeDOrb'
import { floatRotateVariants } from '@/animations/floatingVariants'

const demoCode = `async function getUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  return db.execute(query); // ⚠ SQL Injection
}`

const fixedCode = `async function getUser(id) {
  return db.execute(
    "SELECT * FROM users WHERE id = $1", [id]
  ); // ✓ Secured
}`

const floatingSnippets = [
  { code: 'jwt.verify(token)', x: '5%', y: '15%', delay: 0 },
  { code: 'bcrypt.hash(pwd)', x: '75%', y: '8%', delay: 0.5 },
  { code: 'OWASP.check()', x: '82%', y: '68%', delay: 1 },
]

export function HeroVisual() {
  return (
    <PerspectiveContainer intensity={8} className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center">
      {/* Floating Holographic Floating Code Snippets */}
      {floatingSnippets.map((s, i) => (
        <motion.div
          key={i}
          variants={floatRotateVariants}
          animate="animate"
          transition={{ delay: s.delay }}
          className="absolute hidden xl:block z-20 pointer-events-none"
          style={{ left: s.x, top: s.y }}
        >
          <div className="px-3 py-1.5 rounded-lg glass text-[10px] font-mono text-cyan-400/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-slate-950/80 backdrop-blur-md">
            {s.code}
          </div>
        </motion.div>
      ))}

      {/* Main Holographic Grid Canvas */}
      <div className="relative w-full aspect-square md:aspect-video xl:aspect-square flex items-center justify-center p-4">
        
        {/* Backdrop Grid Mesh */}
        <div className="absolute inset-0 cyber-grid-animate opacity-20 pointer-events-none rounded-2xl border border-white/5" />
        
        {/* Core 3D Interactive AI Orb (Centered) */}
        <div className="absolute z-10 scale-90 md:scale-100">
          <ThreeDOrb />
        </div>

        {/* Floating Telemetry Cockpit Gauges (Left Side Panel) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute left-[2%] xl:left-[-8%] top-[10%] z-20 w-[150px] md:w-[170px]"
        >
          <div className="glass p-3 rounded-xl border border-white/10 shadow-2xl bg-slate-950/80 backdrop-blur-md flex flex-col gap-2.5 text-[10px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5 pb-1 border-b border-white/5 text-cyan-400 font-bold">
              <Cpu className="h-3 w-3 animate-pulse" />
              <span>CORE STATUS</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>NEURAL LAYER</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ['70%', '85%', '70%'] }} 
                  transition={{ duration: 3, repeat: Infinity }} 
                  className="h-full bg-cyan-400" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>SYSTEM LOAD</span>
                <motion.span 
                  animate={{ opacity: [1, 0.4, 1] }}
                  className="text-cyan-400"
                >
                  32.4%
                </motion.span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ['32%', '45%', '28%'] }} 
                  transition={{ duration: 2.5, repeat: Infinity }} 
                  className="h-full bg-cyan-400" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>NET STABILITY</span>
                <span className="text-purple-400 font-bold">99.8%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ['99%', '98%', '99%'] }} 
                  transition={{ duration: 4, repeat: Infinity }} 
                  className="h-full bg-purple-500" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px]">
              <span className="flex items-center gap-1"><Server className="h-2.5 w-2.5 text-purple-400" /> CLOUD NODES</span>
              <span className="text-emerald-400">3/3</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Code Scanner Window (Right Side Panel, elevated and tilting) */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 15 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute right-[2%] xl:right-[-8%] bottom-[8%] z-20 w-[240px] md:w-[280px]"
        >
          <GradientBorderCard glow depth className="shadow-2xl shadow-black/80 rounded-xl overflow-hidden bg-slate-950/90 backdrop-blur-xl">
            <div className="relative p-1">
              <ScanLineEffect active />
              <div className="p-3.5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <span className="text-[10px] font-mono font-bold text-rose-400">AI DETECT: SQL INJECTION</span>
                  </div>
                  <div className="flex items-center gap-1 text-[8px] font-mono text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded bg-rose-500/5">
                    <ShieldAlert className="h-3 w-3" /> RISK: HIGH
                  </div>
                </div>
                
                <div className="scale-95 origin-top-left">
                  <CodeBlock code={demoCode} language="javascript" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 }}
                  className="mt-3 border-t border-white/5 pt-3"
                >
                  <FloatingCard float={false} className="p-0 border-0 bg-transparent shadow-none">
                    <p className="text-[10px] font-mono text-emerald-400 mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 animate-bounce" /> Auto-securing node...
                    </p>
                    <div className="scale-95 origin-top-left">
                      <CodeBlock code={fixedCode} language="javascript" />
                    </div>
                  </FloatingCard>
                </motion.div>
              </div>
            </div>
          </GradientBorderCard>
        </motion.div>

        {/* Small Holographic Scope Reticle (Decoration) */}
        <div className="absolute top-[8%] right-[15%] pointer-events-none opacity-40 z-10 hidden md:block">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-400 animate-spin">
            <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </div>

        {/* Floating Activity Graph telemetry graphic (Center-Bottom) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-10px] left-[15%] z-20 pointer-events-none hidden md:block"
        >
          <div className="glass py-1.5 px-3 rounded-lg border border-white/10 flex items-center gap-2 bg-slate-950/80 text-[8px] font-mono text-cyan-400">
            <Activity className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>LATENCY: 12ms</span>
            <span className="text-emerald-400 font-bold">// 100% THR</span>
          </div>
        </motion.div>
        
      </div>

      <NeuralLines />
    </PerspectiveContainer>
  )
}

function NeuralLines() {
  const nodes = [
    { x1: '10%', y1: '20%', x2: '50%', y2: '45%' },
    { x1: '50%', y1: '45%', x2: '90%', y2: '30%' },
    { x1: '50%', y1: '45%', x2: '80%', y2: '75%' },
    { x1: '20%', y1: '75%', x2: '50%', y2: '45%' },
  ]

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 0 }}>
      {nodes.map((n, i) => (
        <motion.line
          key={i}
          x1={n.x1}
          y1={n.y1}
          x2={n.x2}
          y2={n.y2}
          stroke="url(#neuralGrad)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
      <defs>
        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}


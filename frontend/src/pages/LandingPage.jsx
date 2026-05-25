import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useSpring } from 'framer-motion'
import {
  Brain, Shield, Zap, GitBranch, BarChart3, Code2,
  ArrowRight, Star, Play, CheckCircle2,
} from 'lucide-react'
import logo from '@/assets/logo.svg'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { HeroVisual } from '@/components/landing/HeroVisual'
import { AnimatedStats } from '@/components/landing/AnimatedStats'
import { CinematicBackground } from '@/components/backgrounds/CinematicBackground'
import { GlowButton } from '@/components/common/GlowButton'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/common/GlassCard'
import { FloatingCard } from '@/components/common/FloatingCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { MotionSection } from '@/components/common/MotionSection'
import { CyberBadge } from '@/components/common/CyberBadge'
import { TypingAnimation } from '@/components/common/TypingAnimation'
import { CodeBlock } from '@/components/common/CodeBlock'
import { ParallaxContainer, PerspectiveContainer } from '@/components/common/ParallaxContainer'
import { useMouseParallax } from '@/hooks/useParallax'
import { staggerContainer, staggerItem, staggerItemScale } from '@/animations/staggerVariants'
import { mockFeatures, mockHowItWorks, mockMovieReviews } from '@/utils/mockData'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Loader } from '@/components/common/Loader'
import { MagneticWrapper } from '@/components/common/MagneticWrapper'
import { CursorGlow } from '@/components/common/CursorGlow'

function CanvasParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Respect accessibility settings for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    // Scale count: e.g. 35 particles on large screens, less on mobile to protect CPU/battery
    const particleCount = Math.min(35, Math.floor(window.innerWidth / 40))

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.4,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15 - 0.08, // Slow upward drift
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.dx
        p.y += p.dy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = canvas.height

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
}

const iconMap = { Brain, Shield, Zap, GitBranch, BarChart3, Code2 }
const demoCode = `async function getUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  return db.execute(query); // ⚠ SQL Injection
}`

function HeroSection() {
  const navigate = useNavigate()
  const mouse = useMouseParallax(12)

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <CinematicBackground showCyberLines particleCount={40} />
      {/* Background Glowing Sphere */}
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-float-orb" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none animate-float-orb" style={{ animationDelay: '-5s' }} />

      {/* Spotlight follow effect on Hero Text */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 transition-transform duration-500 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x * 2.5 + 400}px ${mouse.y * 2.5 + 300}px, rgba(34, 211, 238, 0.04), transparent 70%)`
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            style={{ x: mouse.x * 0.5, y: mouse.y * 0.5 }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <CyberBadge pulse className="mb-6">Powered by Advanced AI Models</CyberBadge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] flex flex-wrap gap-x-3 gap-y-1">
              {['Ship', 'Code', 'with'].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.08 }}
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.3 + 0.28 }}
                className="text-gradient neon-text w-full lg:w-auto"
              >
                AI Confidence
              </motion.span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-xl leading-relaxed">
              Intelligent code review that catches bugs, security flaws, and performance issues before they reach production.
            </p>
            <p className="text-primary font-mono text-sm mb-8 h-6">
              <TypingAnimation
                texts={[
                  'Scanning for vulnerabilities...',
                  'Analyzing performance patterns...',
                  'Checking best practices...',
                  'Generating fix suggestions...',
                ]}
              />
            </p>
            <div className="flex flex-wrap gap-4">
              <MagneticWrapper>
                <GlowButton onClick={() => navigate('/dashboard')}>
                  Start Free Review <ArrowRight className="h-4 w-4" />
                </GlowButton>
              </MagneticWrapper>
              <MagneticWrapper>
                <Button variant="outline" size="lg" onClick={() => navigate('/auth/signup')}>
                  <Play className="h-4 w-4" /> Watch Demo
                </Button>
              </MagneticWrapper>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-muted-foreground">
              {['No credit card', '20+ languages', 'SOC 2 ready'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-full overflow-visible"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <MotionSection id="features" className="py-24 relative overflow-hidden">
      {/* Background Glowing Sphere */}
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none animate-float-orb" />
      <div className="container mx-auto px-4" ref={ref}>
        <SectionHeader badge="Features" title="Everything You Need for Better Code" description="Enterprise-grade analysis tools designed for modern development workflows." className="mb-16" />
        <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
          {mockFeatures.map((f) => {
            const Icon = iconMap[f.icon]
            return (
              <motion.div key={f.title} variants={staggerItemScale}>
                <PerspectiveContainer intensity={8} className="h-full">
                  <FloatingCard depth className="h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </FloatingCard>
                </PerspectiveContainer>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </MotionSection>
  )
}

function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <MotionSection id="how-it-works" className="py-24 bg-card/20">
      <div className="container mx-auto px-4" ref={ref}>
        <SectionHeader badge="How It Works" title="From Code to Confidence in Minutes" description="Four simple steps to transform your code review process." className="mb-16" />
        <div className="relative max-w-4xl mx-auto">
          {/* Animated flowing connection line timeline indicator */}
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/20 via-secondary/20 to-transparent hidden md:block overflow-hidden">
            <motion.div
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] will-change-transform"
            />
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate={isVisible ? 'visible' : 'hidden'} className="space-y-8">
            {mockHowItWorks.map((item) => (
              <motion.div key={item.step} variants={staggerItem} className="flex gap-6 md:gap-8">
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(34,211,238,0.3)' }}
                  className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 text-xl font-bold text-primary"
                >
                  {item.step}
                </motion.div>
                <PerspectiveContainer intensity={5} className="flex-1">
                  <GlassCard depth className="h-full">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </GlassCard>
                </PerspectiveContainer>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </MotionSection>
  )
}

function DemoSection() {
  const navigate = useNavigate()
  return (
    <MotionSection id="demo" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 w-full max-w-full overflow-hidden">
        <ParallaxContainer speed={0.15} className="w-full max-w-full overflow-hidden">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 w-full max-w-full"
          >
            <div className="grid lg:grid-cols-2 w-full max-w-full overflow-hidden">
              <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-card/50 backdrop-blur-xl w-full max-w-full overflow-hidden min-w-0">
                <CyberBadge className="mb-4 w-fit">Live Demo</CyberBadge>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">See AI Review in Action</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                  Paste any code snippet and watch our AI identify issues, suggest fixes, and explain the reasoning — in real-time.
                </p>
                <div className="w-fit">
                  <MagneticWrapper>
                    <GlowButton onClick={() => navigate('/dashboard')}>
                      Try It Now <ArrowRight className="h-4 w-4" />
                    </GlowButton>
                  </MagneticWrapper>
                </div>
              </div>
              <div className="bg-[#0d1117] p-4 md:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border relative w-full max-w-full overflow-hidden min-w-0">
                <motion.p
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs text-primary font-mono mb-4"
                >
                  ▸ Neural scan: line 1... line 2... line 3...
                </motion.p>
                <CodeBlock code={demoCode} language="javascript" />
              </div>
            </div>
          </motion.div>
        </ParallaxContainer>
      </div>
    </MotionSection>
  )
}

function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation()

  const ltrItems = [...mockMovieReviews, ...mockMovieReviews]
  const rtlItems = [...[...mockMovieReviews].reverse(), ...[...mockMovieReviews].reverse()]

  return (
    <MotionSection id="testimonials" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 mb-16" ref={ref}>
        <SectionHeader
          badge="Testimonials"
          title="Movie Ratings & Reviews"
          description="Check out our engineering team's favorite tech and sci-fi films represented inside the platform."
          className="text-center"
        />
      </div>

      <div className="w-full max-w-full space-y-6">
        {/* Row 1: Left to Right */}
        <div className="marquee-container">
          <div className="animate-marquee-ltr flex py-2">
            {ltrItems.map((t, idx) => (
              <div key={`ltr-${t.id}-${idx}`} className="w-[404px] shrink-0 pr-6">
                <GlassCard depth hover className="h-full w-full flex items-start gap-4 p-5 min-h-[160px]">
                  {/* Poster Thumbnail */}
                  <div className={`w-16 h-24 shrink-0 rounded-lg bg-gradient-to-br ${t.posterGradient} border flex flex-col items-center justify-center relative overflow-hidden shadow-md shadow-black/40`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="text-lg font-black tracking-wider text-foreground select-none relative z-10">{t.posterCode}</span>
                    <div className="absolute bottom-1 left-0 right-0 text-[8px] font-mono opacity-40 text-center uppercase tracking-widest relative z-10">POSTER</div>
                  </div>
                  {/* Review Info */}
                  <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1 truncate">{t.movieName}</h4>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/35'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                        {t.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs leading-none text-foreground truncate">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="marquee-container">
          <div className="animate-marquee-rtl flex py-2">
            {rtlItems.map((t, idx) => (
              <div key={`rtl-${t.id}-${idx}`} className="w-[404px] shrink-0 pr-6">
                <GlassCard depth hover className="h-full w-full flex items-start gap-4 p-5 min-h-[160px]">
                  {/* Poster Thumbnail */}
                  <div className={`w-16 h-24 shrink-0 rounded-lg bg-gradient-to-br ${t.posterGradient} border flex flex-col items-center justify-center relative overflow-hidden shadow-md shadow-black/40`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="text-lg font-black tracking-wider text-foreground select-none relative z-10">{t.posterCode}</span>
                    <div className="absolute bottom-1 left-0 right-0 text-[8px] font-mono opacity-40 text-center uppercase tracking-widest relative z-10">POSTER</div>
                  </div>
                  {/* Review Info */}
                  <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1 truncate">{t.movieName}</h4>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/35'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                        {t.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs leading-none text-foreground truncate">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  )
}

function CTASection() {
  const navigate = useNavigate()
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background Glowing Sphere */}
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-float-orb" />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-primary/20"
        >
          <CinematicBackground showGrid={false} showParticles particleCount={20} className="opacity-60" />
          <div className="relative z-10 text-center py-20 px-8 flex flex-col items-center justify-center">
            <motion.img
              src={logo}
              alt="Logo"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
              className="h-32 w-auto object-contain mb-6 drop-shadow-[0_0_35px_rgba(34,211,238,0.35)] flex-shrink-0"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up Your Code Reviews?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of developers shipping safer, faster, and smarter code every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticWrapper>
                <GlowButton onClick={() => navigate('/auth/signup')}>Get Started Free</GlowButton>
              </MagneticWrapper>
              <MagneticWrapper>
                <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>Open Dashboard</Button>
              </MagneticWrapper>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Custom scroll depth scale/blur container (Apple/Vercel style)
function ScrollDepthContainer({ children }) {
  const ref = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    setIsMobile(media.matches)
    const listener = (e) => setIsMobile(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Smooth scroll mapping
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.93, 1, 1, 0.93])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4])
  const blurVal = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [8, 0, 0, 8])
  const filter = useMotionTemplate`blur(${blurVal}px)`

  if (isMobile) {
    return <div ref={ref}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        opacity,
        filter,
        transformOrigin: 'center center',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </motion.div>
  )
}

// Fixed scroll progress timeline telemetry indicator
function ScrollTelemetryTimeline() {
  const { scrollYProgress } = useScroll()
  const lineScaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const sections = [
    { id: 'hero', label: '01 // INTRO' },
    { id: 'stats', label: '02 // ANALYTICS' },
    { id: 'features', label: '03 // FEATURES' },
    { id: 'how-it-works', label: '04 // PIPELINE' },
    { id: 'demo', label: '05 // LIVE' },
    { id: 'testimonials', label: '06 // RATINGS' },
    { id: 'cta', label: '07 // JOIN' }
  ]

  const handleScrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-6 pointer-events-auto">
      {/* Track bar */}
      <div className="relative w-[1.5px] h-[250px] bg-white/5 rounded-full overflow-hidden">
        <motion.div
          style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-cyan-400 via-cyan-400 to-purple-500 shadow-[0_0_8px_#22d3ee]"
        />
      </div>

      {/* Anchors */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between h-[250px] pointer-events-none">
        {sections.map((sec, idx) => {
          const threshold = idx / (sections.length - 1)
          const isActive = useTransform(scrollYProgress, (val) => val >= threshold - 0.06)

          return (
            <div
              key={sec.id}
              className="relative group flex items-center pointer-events-auto cursor-pointer"
              onClick={() => handleScrollTo(sec.id)}
            >
              <motion.div
                style={{
                  boxShadow: isActive ? '0 0 10px #22d3ee' : 'none'
                }}
                className={`h-2 w-2 rounded-full border transition-all duration-300 ${isActive
                    ? 'bg-cyan-400 border-cyan-400 scale-125'
                    : 'bg-slate-950 border-white/20 hover:border-cyan-400/50 hover:scale-110'
                  }`}
              />
              <div className="absolute left-6 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-mono text-[9px] text-cyan-400/90 whitespace-nowrap bg-slate-950/80 px-2 py-1 rounded border border-white/5 backdrop-blur-md">
                {sec.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true)

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" onComplete={() => setLoading(false)} />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="min-h-screen relative"
        >
          {/* Custom Ambient Cursor Glow follower (desktop only) */}
          <CursorGlow />

          {/* Premium Film Grain Noise overlay */}
          <div className="noise-overlay" />

          {/* Drifting Cyber Particles canvas backdrop */}
          <CanvasParticles />

          <Navbar />
          <ScrollTelemetryTimeline />

          <ScrollDepthContainer>
            <HeroSection />
          </ScrollDepthContainer>

          <ScrollDepthContainer>
            <div id="stats">
              <AnimatedStats />
            </div>
          </ScrollDepthContainer>

          <ScrollDepthContainer>
            <FeaturesSection />
          </ScrollDepthContainer>

          <ScrollDepthContainer>
            <HowItWorksSection />
          </ScrollDepthContainer>

          <ScrollDepthContainer>
            <DemoSection />
          </ScrollDepthContainer>

          <ScrollDepthContainer>
            <TestimonialsSection />
          </ScrollDepthContainer>

          <ScrollDepthContainer>
            <CTASection />
          </ScrollDepthContainer>

          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

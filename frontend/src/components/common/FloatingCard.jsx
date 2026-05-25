import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/utils/cn'
import { floatSlowVariants } from '@/animations/floatingVariants'

export function FloatingCard({ children, className, delay = 0, float = true }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const cardRef = useRef(null)

  const springConfig = { damping: 22, stiffness: 200, mass: 0.8 }
  const xSpring = useSpring(rotateX, springConfig)
  const ySpring = useSpring(rotateY, springConfig)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const xVal = clientX - left
    const yVal = clientY - top
    mouseX.set(xVal)
    mouseY.set(yVal)

    // Scale tilt range
    const xRotation = ((yVal - height / 2) / height) * -10
    const yRotation = ((xVal - width / 2) / width) * 10
    rotateX.set(xRotation)
    rotateY.set(yRotation)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={float ? floatSlowVariants : undefined}
      animate={float ? 'animate' : undefined}
      transition={{ delay }}
      style={{
        rotateX: xSpring,
        rotateY: ySpring,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'rounded-xl glass p-6 relative group overflow-hidden border border-white/5 transition-all duration-300 holo-sheen cyber-border-glow',
        className
      )}
    >
      {/* Spotlight glow following mouse */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 z-0"
        style={{
          transform: 'translateZ(10px)',
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(34, 211, 238, 0.09),
              rgba(168, 85, 247, 0.04),
              transparent 80%
            )
          `,
        }}
      />
      <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none z-0" />
      
      {/* 3D Translation depth layer */}
      <div 
        className="relative z-10 w-full h-full"
        style={{ transform: 'translateZ(20px)' }}
      >
        {children}
      </div>
    </motion.div>
  )
}


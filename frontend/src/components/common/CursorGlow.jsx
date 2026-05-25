import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false)

  const mouseX = useMotionValue(-300)
  const mouseY = useMotionValue(-300)

  // Configure spring physics for a premium trailing lag aura
  const springConfig = { damping: 45, stiffness: 300, mass: 0.4 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only enable on desktop screens and if user doesn't prefer reduced motion
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.innerWidth < 1024
    ) {
      return
    }

    setEnabled(true)

    const handleMouseMove = (e) => {
      // Offset by half of width/height (144px for a 288px w-72 circle)
      mouseX.set(e.clientX - 144)
      mouseY.set(e.clientY - 144)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  if (!enabled) return null

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        willChange: 'transform',
      }}
      className="fixed w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12)_0%,rgba(168,85,247,0.06)_50%,transparent_100%)] pointer-events-none z-[999] mix-blend-screen blur-xl"
    />
  )
}

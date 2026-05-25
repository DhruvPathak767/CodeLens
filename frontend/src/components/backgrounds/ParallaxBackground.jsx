import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ParallaxBackground({ children, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 pointer-events-none">
        {children}
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 pointer-events-none opacity-50"
      >
        <div
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'rgba(168, 85, 247, 0.06)' }}
        />
      </motion.div>
    </div>
  )
}

import { motion } from 'framer-motion'

const orbs = [
  { x: '15%', y: '20%', size: 300, color: 'rgba(34, 211, 238, 0.08)', duration: 12 },
  { x: '75%', y: '15%', size: 250, color: 'rgba(168, 85, 247, 0.07)', duration: 15 },
  { x: '60%', y: '70%', size: 200, color: 'rgba(6, 182, 212, 0.06)', duration: 10 },
  { x: '10%', y: '75%', size: 180, color: 'rgba(34, 211, 238, 0.05)', duration: 14 },
]

export function GlowOrbLayer({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.9, 0.5],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
        />
      ))}
    </div>
  )
}

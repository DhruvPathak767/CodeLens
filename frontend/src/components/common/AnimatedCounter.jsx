import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

export function AnimatedCounter({ value }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  // Deconstruct stats with prefix/suffix (e.g. "2M+", "99.2%", "<3s")
  let targetNumber = 0
  let prefix = ''
  let suffix = ''
  let decimals = 0

  const match = value.match(/^([^0-9.]*)([0-9.]+)([^0-9.]*)$/)
  if (match) {
    prefix = match[1]
    targetNumber = parseFloat(match[2]) || 0
    suffix = match[3]
    const decimalParts = match[2].split('.')
    if (decimalParts.length > 1) {
      decimals = decimalParts[1].length
    }
  } else {
    targetNumber = parseFloat(value) || 0
  }

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 40, damping: 15 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetNumber)
    }
  }, [isInView, targetNumber, motionValue])

  useEffect(() => {
    return springValue.onChange((latest) => {
      setDisplayValue(latest)
    })
  }, [springValue])

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export const floatVariants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const floatSlowVariants = {
  animate: {
    y: [0, -20, 0],
    x: [0, 6, 0],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const floatRotateVariants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 2, -2, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const orbitVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 30, repeat: Infinity, ease: 'linear' },
  },
}

export const pulseFloatVariants = {
  animate: {
    y: [0, -8, 0],
    scale: [1, 1.02, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

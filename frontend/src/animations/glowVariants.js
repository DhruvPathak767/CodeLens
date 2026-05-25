export const glowPulseVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(34, 211, 238, 0.15)',
      '0 0 50px rgba(34, 211, 238, 0.35)',
      '0 0 20px rgba(34, 211, 238, 0.15)',
    ],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const glowBorderVariants = {
  animate: {
    borderColor: [
      'rgba(34, 211, 238, 0.2)',
      'rgba(168, 85, 247, 0.4)',
      'rgba(34, 211, 238, 0.2)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const scanGlowVariants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    scale: [0.98, 1, 0.98],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

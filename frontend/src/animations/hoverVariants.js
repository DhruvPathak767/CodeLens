export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

export const hoverGlow = {
  rest: { scale: 1, boxShadow: '0 0 0 rgba(34, 211, 238, 0)' },
  hover: {
    scale: 1.03,
    boxShadow: '0 8px 40px rgba(34, 211, 238, 0.2)',
    transition: { duration: 0.3 },
  },
}

export const hoverDepth = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: {
    scale: 1.02,
    rotateX: 3,
    rotateY: -3,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
}

export const tapScale = {
  tap: { scale: 0.97 },
}

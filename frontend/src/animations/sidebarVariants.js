export const sidebarVariants = {
  closed: { x: -280, opacity: 0 },
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 28, stiffness: 280 },
  },
}

export const sidebarOverlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.25 } },
}

export const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
}

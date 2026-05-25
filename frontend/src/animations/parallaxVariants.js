export const parallaxLayer = (speed = 0.5) => ({
  y: (scrollY) => scrollY * speed,
})

export const revealOnScroll = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const perspectiveReveal = {
  hidden: { opacity: 0, rotateX: 12, y: 40, transformPerspective: 1200 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

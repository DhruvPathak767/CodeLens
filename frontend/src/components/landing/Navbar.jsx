import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { cn } from '@/utils/cn'
import { APP_NAME, NAV_LINKS } from '@/utils/constants'
import { GlowButton } from '@/components/common/GlowButton'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/common/ThemeToggle'

const mobileMenuContainer = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
}

const mobileMenuItem = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 26 }
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2 }
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scrolling when mobile menu side drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/70 backdrop-blur-2xl border-b border-border py-3 shadow-lg shadow-black/20'
          : 'py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img
            src={logo}
            alt="Logo"
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="h-10 w-auto object-contain flex-shrink-0"
          />
          <span className="font-bold text-2xl tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ y: -2, color: '#22d3ee' }}
              className="text-sm text-muted-foreground transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => navigate('/auth/login')}>Log in</Button>
          <GlowButton size="md" onClick={() => navigate('/auth/signup')}>Get Started</GlowButton>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Menu />
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md md:hidden"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-[300px] max-w-[80vw] z-50 bg-card/95 backdrop-blur-3xl border-l border-border p-6 shadow-2xl md:hidden flex flex-col justify-between overflow-y-auto"
            >
              <div className="flex flex-col gap-6">
                {/* Drawer Title and Close Control */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="font-bold text-lg tracking-tight">{APP_NAME}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    className="h-9 w-9 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Sidebar Navigation links */}
                <nav className="flex flex-col gap-6">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors py-1.5"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Footer configuration inside drawer */}
              <div className="pt-6 border-t border-border flex items-center justify-between gap-1 mt-8">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  className="text-sm px-2 font-medium shrink-0"
                  onClick={() => {
                    navigate('/auth/login')
                    setMobileOpen(false)
                  }}
                >
                  Log in
                </Button>
                <GlowButton
                  size="sm"
                  className="text-xs font-semibold py-1.5 px-3 shrink-0"
                  onClick={() => {
                    navigate('/auth/signup')
                    setMobileOpen(false)
                  }}
                >
                  Get Started
                </GlowButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}


import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '@/assets/logo.svg'
import { CinematicBackground } from '@/components/backgrounds/CinematicBackground'
import { AuthBranding } from '@/components/auth/AuthPanel'
import { APP_NAME } from '@/utils/constants'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <CinematicBackground showCyberLines particleCount={35} className="opacity-90" />

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 border-r border-border">
        <AuthBranding />
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30"
            >
              <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
            </motion.div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

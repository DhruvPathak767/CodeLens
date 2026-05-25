import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CinematicBackground } from '@/components/backgrounds/CinematicBackground'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileSidebar } from '@/components/dashboard/MobileSidebar'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { useAuth } from '@/context/AuthContext'
import { pageVariants } from '@/animations/pageVariants'
import toast from 'react-hot-toast'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <CinematicBackground showCyberLines particleCount={20} className="opacity-80" />

      {/* Floating glass sidebar — desktop */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-64 flex-col fixed inset-y-4 left-4 z-30 rounded-2xl glass-strong border border-border shadow-2xl shadow-black/40 overflow-hidden"
      >
        <Sidebar onLogout={handleLogout} />
      </motion.aside>

      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 lg:ml-[calc(16rem+2rem)] flex flex-col min-h-screen relative z-10">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <motion.main
          initial="initial"
          animate="animate"
          variants={pageVariants}
          className="flex-1 p-4 lg:p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}

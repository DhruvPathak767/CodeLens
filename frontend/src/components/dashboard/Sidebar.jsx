import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, History, Settings, LogOut, BarChart3, Terminal, Bookmark, Bell } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { cn } from '@/utils/cn'
import { APP_NAME, SIDEBAR_LINKS } from '@/utils/constants'
import { navItemVariants } from '@/animations/sidebarVariants'
import { useNotifications } from '@/context/NotificationContext'

const iconMap = {
  LayoutDashboard,
  History,
  Settings,
  BarChart3,
  Terminal,
  Bookmark,
  Bell
}

export function Sidebar({ onNavigate, onLogout }) {
  const { unreadCount } = useNotifications()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
        <motion.img
          src={logo}
          alt="Logo"
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="h-10 w-auto object-contain flex-shrink-0"
        />
        <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {SIDEBAR_LINKS.map((link, i) => {
          const Icon = iconMap[link.icon]
          const isNotifications = link.icon === 'Bell'

          return (
            <motion.div key={link.path} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
              <NavLink
                to={link.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </div>
                {isNotifications && unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-[10px] font-bold text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </motion.button>
      </div>
    </div>
  )
}

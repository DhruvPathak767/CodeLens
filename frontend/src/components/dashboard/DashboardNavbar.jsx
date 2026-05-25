import { motion } from 'framer-motion'
import { Menu, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { SearchBar } from '@/components/common/SearchBar'
import { Button } from '@/components/ui/Button'

export function DashboardNavbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 lg:px-8 border-b border-border bg-background/60 backdrop-blur-2xl"
    >
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:block flex-1 max-w-sm">
          <SearchBar placeholder="Search reviews..." />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <motion.span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Button>
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20"
          >
            {user?.name?.[0]?.toUpperCase() || 'D'}
          </motion.div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{user?.name || 'Developer'}</p>
            <p className="text-[11px] text-muted-foreground">{user?.email || 'dev@codelens.ai'}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
        </div>
      </div>
    </motion.header>
  )
}

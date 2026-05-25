import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { sidebarVariants, sidebarOverlayVariants } from '@/animations/sidebarVariants'

export function MobileSidebar({ open, onClose, onLogout }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={sidebarOverlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col glass-strong border-r border-border lg:hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted/50 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={onClose} onLogout={onLogout} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

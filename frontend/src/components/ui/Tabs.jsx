import { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const TabsContext = createContext(null)

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [internal, setInternal] = useState(defaultValue)
  const active = value ?? internal
  const setActive = onValueChange ?? setInternal

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }) {
  return (
    <div className={cn('inline-flex h-10 items-center justify-center rounded-lg bg-muted/40 p-1 gap-1', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className, children }) {
  const { active, setActive } = useContext(TabsContext)
  const isActive = active === value

  return (
    <button
      type="button"
      onClick={() => setActive(value)}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-md bg-card border border-border shadow-sm"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function TabsContent({ value, className, children }) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('mt-4', className)}
    >
      {children}
    </motion.div>
  )
}

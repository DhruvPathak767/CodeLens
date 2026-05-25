import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

export function SearchBar({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <motion.div
      initial={{ opacity: 0, width: '90%' }}
      animate={{ opacity: 1, width: '100%' }}
      className={cn('relative', className)}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 bg-white/5 border-white/10 focus:border-primary/40"
      />
    </motion.div>
  )
}

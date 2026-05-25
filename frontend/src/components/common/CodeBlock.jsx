import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
 
export function CodeBlock({ code, language, title, className, showLineNumbers = false }) {
  const [copied, setCopied] = useState(false)
  const lines = code?.split('\n') || []
 
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-xl overflow-hidden border border-border bg-card w-full max-w-full', className)}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          {title && <span className="text-xs text-muted-foreground ml-2 font-mono">{title}</span>}
          {language && !title && (
            <span className="text-xs text-muted-foreground ml-2 font-mono">{language}</span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed w-full max-w-full">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="select-none text-muted-foreground/50 w-8 shrink-0 text-right pr-4">
                  {i + 1}
                </span>
              )}
              <span className="text-foreground">{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </motion.div>
  )
}


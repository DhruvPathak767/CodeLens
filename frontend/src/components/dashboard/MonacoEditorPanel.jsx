import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { Select } from '@/components/ui/Select'
import { ScanLineEffect } from '@/components/common/ScanLineEffect'
import { LANGUAGES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { glowPulseVariants } from '@/animations/glowVariants'
import { useTheme } from '@/context/ThemeContext'

export function MonacoEditorPanel({ code, onChange, language, onLanguageChange, scanning = false, className }) {
  const { theme } = useTheme()

  return (
    <motion.div
      variants={scanning ? glowPulseVariants : undefined}
      animate={scanning ? 'animate' : undefined}
      className={cn('relative rounded-xl overflow-hidden', className)}
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 opacity-60" />
      <div className="relative rounded-[11px] overflow-hidden border border-border bg-card">
        {scanning && <ScanLineEffect active />}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="w-36">
            <Select value={language} onChange={onLanguageChange} options={LANGUAGES} />
          </div>
        </div>
        <Editor
          height="340px"
          language={language}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={code}
          onChange={(v) => onChange(v || '')}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>
    </motion.div>
  )
}


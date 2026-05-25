import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileCode } from 'lucide-react'
import { cn } from '@/utils/cn'

export function UploadZone({ onFileLoad, className }) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => onFileLoad(e.target.result, file.name)
    reader.readAsText(file)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".js,.ts,.tsx,.jsx,.py,.java,.go,.rs,.cpp,.cs,.rb,.php,.txt"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        animate={{
          borderColor: dragOver ? 'rgba(34, 211, 238, 0.6)' : 'rgba(255,255,255,0.15)',
          boxShadow: dragOver ? '0 0 40px rgba(34, 211, 238, 0.15)' : '0 0 0 transparent',
        }}
        whileHover={{ scale: 1.01 }}
        className={cn(
          'w-full border-2 border-dashed rounded-xl p-10 text-center transition-colors',
          'bg-white/[0.02] hover:bg-primary/5',
          dragOver && 'bg-primary/10',
          className
        )}
      >
        <motion.div animate={dragOver ? { y: -4 } : { y: 0 }}>
          {dragOver ? (
            <FileCode className="h-10 w-10 mx-auto mb-3 text-primary" />
          ) : (
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          )}
        </motion.div>
        <p className="text-sm font-medium">
          {dragOver ? 'Drop to upload' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">JS, TS, Python, Go, Java, Rust, and more</p>
      </motion.button>
    </>
  )
}

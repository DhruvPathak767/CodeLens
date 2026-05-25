import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code, Terminal, Search, Plus, Trash2, Edit2, 
  Save, X, RefreshCw, Sparkles
} from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { GlowButton } from '@/components/common/GlowButton'
import { Button } from '@/components/ui/Button'
import { CyberBadge } from '@/components/common/CyberBadge'
import { MonacoEditorPanel } from '@/components/dashboard/MonacoEditorPanel'
import { snippetService } from '@/services/snippetService'
import { staggerContainer, staggerItem } from '@/animations/staggerVariants'
import { LANGUAGES } from '@/utils/constants'
import toast from 'react-hot-toast'

export default function SnippetsPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  
  // Modal / Drawer Editor states
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState(null) // null for create
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Write or paste your reusable snippet here')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  // Queries & Mutations powered by React Query
  const { data: snippets = [], isLoading } = useQuery({
    queryKey: ['snippets'],
    queryFn: snippetService.getSnippets,
    staleTime: 30000,
  })

  const saveSnippetMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingSnippet) {
        return snippetService.updateSnippet(editingSnippet._id, payload)
      } else {
        return snippetService.createSnippet(payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
      setEditorOpen(false)
      toast.success(editingSnippet ? 'Snippet updated successfully' : 'Snippet saved successfully')
    },
    onError: (err) => {
      toast.error('Failed to save snippet: ' + err.message)
    }
  })

  const deleteSnippetMutation = useMutation({
    mutationFn: snippetService.deleteSnippet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
      toast.success('Snippet deleted successfully')
    },
    onError: (err) => {
      toast.error('Failed to delete snippet: ' + err.message)
    }
  })

  const handleOpenCreate = () => {
    setEditingSnippet(null)
    setTitle('')
    setLanguage('javascript')
    setCode('// Write or paste your reusable snippet here')
    setTags([])
    setTagInput('')
    setEditorOpen(true)
  }

  const handleOpenEdit = (snippet) => {
    setEditingSnippet(snippet)
    setTitle(snippet.title)
    setLanguage(snippet.language)
    setCode(snippet.code)
    setTags(snippet.tags || [])
    setTagInput('')
    setEditorOpen(true)
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault()
      const cleanTag = tagInput.trim().toLowerCase()
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag])
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, i) => i !== indexToRemove))
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!title.trim() || !code.trim()) {
      toast.error('Please fill in title and code content')
      return
    }

    saveSnippetMutation.mutate({ title, language, code, tags })
  }

  const handleDelete = (id, e) => {
    e.stopPropagation() // Prevent triggering card click
    if (!window.confirm('Are you sure you want to delete this snippet?')) return
    deleteSnippetMutation.mutate(id)
  }

  // Filter snippets based on search keywords and tags selection
  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !selectedTag || s.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  // Extract all distinct tags for filtering list
  const allTagsSet = new Set()
  snippets.forEach((s) => s.tags?.forEach((t) => allTagsSet.add(t)))
  const allTagsList = Array.from(allTagsSet)

  return (
    <div className="space-y-8 relative min-h-[80vh] font-sans">
      {/* Header action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <CyberBadge pulse className="mb-4">Developer Snippets</CyberBadge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 neon-text">Saved Snippets</h1>
          <p className="text-muted-foreground text-sm">Store, search, and reuse code snippets for instantaneous AI audits.</p>
        </motion.div>
        
        <GlowButton onClick={handleOpenCreate} className="w-fit self-end">
          <Plus className="h-4 w-4" /> Create Snippet
        </GlowButton>
      </div>

      {/* Filter workspace */}
      <div className="grid md:grid-cols-4 gap-6">
        
        {/* Left Side Filter Panel */}
        <div className="space-y-4 md:col-span-1">
          <GlassCard depth className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search snippets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            
            <div className="border-t border-border pt-4">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-3">Tags Index</span>
              {allTagsList.length === 0 ? (
                <span className="text-xs text-muted-foreground font-mono">No tags loaded.</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono transition-colors ${
                      !selectedTag
                        ? 'bg-primary/20 border-primary/40 text-primary'
                        : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All Tags
                  </button>
                  {allTagsList.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono transition-colors ${
                        selectedTag === tag
                          ? 'bg-primary/20 border-primary/40 text-primary'
                          : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Side Cards Grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <RefreshCw className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : filteredSnippets.length === 0 ? (
            <GlassCard depth className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
              <Terminal className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="font-semibold text-foreground mb-2">No code snippets found</p>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Create a snippet or adjust filters to explore your reusable database fragments.
              </p>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4" /> Save First Snippet
              </Button>
            </GlassCard>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 gap-4"
            >
              {filteredSnippets.map((snippet) => (
                <motion.div key={snippet._id || snippet.id} variants={staggerItem}>
                  <GlassCard
                    depth
                    className="p-5 flex flex-col justify-between hover:border-primary/30 cursor-pointer h-full transition-colors group"
                    onClick={() => handleOpenEdit(snippet)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs font-mono text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                          {snippet.language}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate('/dashboard', {
                                state: { code: snippet.code, language: snippet.language }
                              })
                            }}
                            className="p-1.5 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors"
                            title="Analyze Snippet"
                          >
                            <Sparkles className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenEdit(snippet)
                            }}
                            className="p-1.5 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-colors"
                            title="Edit Snippet"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(snippet._id || snippet.id, e)}
                            disabled={deleteSnippetMutation.isPending}
                            className="p-1.5 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                            title="Delete Snippet"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-foreground mb-2 text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {snippet.title}
                      </h3>
                      <pre className="text-[10px] font-mono bg-muted/40 text-foreground border border-border rounded-lg p-3 overflow-hidden line-clamp-4 h-24 mb-4">
                        {snippet.code}
                      </pre>
                    </div>

                    {/* Tags row */}
                    {snippet.tags && snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                        {snippet.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono text-muted-foreground bg-muted/30 border border-border px-1.5 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Futuristic Drawer Modal - Monaco Editor Drawer */}
      <AnimatePresence>
        {editorOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditorOpen(false)}
              className="absolute inset-0 bg-black backdrop-blur-sm"
            />
            
            {/* Drawer Body Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-card border-l border-border h-screen shadow-2xl flex flex-col z-10"
            >
              <form onSubmit={handleSave} className="flex flex-col h-full">
                {/* Header info */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/40 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary animate-pulse" />
                    <span className="font-bold text-foreground tracking-tight">
                      {editingSnippet ? 'Edit Code Snippet' : 'Save Reusable Snippet'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className="p-1.5 rounded-xl bg-muted/30 border border-border hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Editor Inputs workspace */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block">Snippet Title</label>
                    <input
                      type="text"
                      placeholder="e.g. SQL Injection parameterized statement secure fix"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block">Programming Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value} className="bg-card">
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Code Monaco Editor Panel wrapper */}
                  <div className="space-y-2 flex flex-col h-[300px]">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block">Snippet Source Code</label>
                    <div className="flex-1 rounded-xl overflow-hidden border border-border bg-muted/40 relative p-1.5">
                      <MonacoEditorPanel
                        code={code}
                        onChange={setCode}
                        language={language}
                        showLanguageSelector={false}
                        className="h-full border-0 rounded-lg overflow-hidden"
                      />
                    </div>
                  </div>

                  {/* Tags workspace */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block">Search Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. security, helper (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="flex-1 bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50"
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline" className="rounded-xl">
                        Add
                      </Button>
                    </div>
                    {/* Tags render bubble lists */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tags.map((tag, idx) => (
                          <span
                            key={tag}
                            className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(idx)}
                              className="text-primary hover:text-red-400 font-bold transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons actions */}
                <div className="px-6 py-5 border-t border-border bg-card/40 backdrop-blur-md flex items-center justify-between gap-3">
                  <div>
                    {editingSnippet && (
                      <Button 
                        type="button" 
                        onClick={() => {
                          setEditorOpen(false)
                          navigate('/dashboard', {
                            state: { code, language }
                          })
                        }}
                        variant="outline" 
                        className="rounded-xl border-primary/50 text-primary hover:bg-primary/10 gap-1.5"
                      >
                        <Sparkles className="h-4 w-4" /> Analyze Snippet
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" onClick={() => setEditorOpen(false)} variant="outline" className="rounded-xl">
                      Cancel
                    </Button>
                    <GlowButton type="submit" disabled={saveSnippetMutation.isPending}>
                      <Save className="h-4 w-4" /> {saveSnippetMutation.isPending ? 'Saving...' : 'Save Snippet'}
                    </GlowButton>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

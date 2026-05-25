import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardPaste, Sparkles, Clock, ArrowRight, AlertTriangle } from 'lucide-react'
import { GlowButton } from '@/components/common/GlowButton'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/common/GlassCard'
import { CyberBadge } from '@/components/common/CyberBadge'
import { MonacoEditorPanel } from '@/components/dashboard/MonacoEditorPanel'
import { UploadZone } from '@/components/dashboard/UploadZone'
import { AIReviewLoader } from '@/components/dashboard/AIReviewLoader'
import { ReviewCard } from '@/components/dashboard/ReviewCard'
import { useReviewsListQuery, useAnalyzeMutation, useReviewStatusQuery } from '@/hooks/useReviewsQuery'
import { useDashboardOverviewQuery } from '@/hooks/useDashboardQuery'
import { staggerContainer } from '@/animations/staggerVariants'
import toast from 'react-hot-toast'

const defaultCode = `function fetchUserData(userId) {
  const url = \`/api/users/\${userId}\`;
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.log(err));
}`

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const [code, setCode] = useState(defaultCode)
  const [language, setLanguage] = useState('javascript')
  const [activeTab, setActiveTab] = useState('editor')
  const [activeStatusId, setActiveStatusId] = useState(null)

  // Load passed snippet code and language from router history state
  useEffect(() => {
    if (location.state?.code) {
      setCode(location.state.code)
      if (location.state.language) {
        setLanguage(location.state.language)
      }
      setActiveTab('editor')
      // Clear state in history to prevent re-populating on hot reloads or refreshes
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, navigate, location.pathname])

  // Queries & Mutations powered by React Query
  const { data: reviewsData, isLoading: reviewsLoading } = useReviewsListQuery()
  const { data: overviewData } = useDashboardOverviewQuery()
  const analyzeMutation = useAnalyzeMutation()

  // Background Polling status query
  const { data: statusData } = useReviewStatusQuery(
    activeStatusId,
    !!activeStatusId // Only poll when activeStatusId is present
  )

  useEffect(() => {
    if (!statusData) return

    if (statusData.status === 'completed') {
      // Extract target string identifier from populated review object structure
      const reviewId = typeof statusData.review === 'object' && statusData.review !== null
        ? (statusData.review._id || statusData.review.id)
        : statusData.review

      setActiveStatusId(null)
      toast.success('Code analysis successfully completed!')
      
      // Invalidate dashboard and reviews lists
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      
      navigate(`/review/${reviewId}`)
    } else if (statusData.status === 'failed') {
      setActiveStatusId(null)
      toast.error(statusData.error || 'Vulnerability scanning failed.')
    }
  }, [statusData, navigate, queryClient])

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze')
      return
    }

    try {
      const result = await analyzeMutation.mutateAsync({ code, language })
      const statusId = result._id || result.id

      if (!statusId) {
        throw new Error('No tracking identifier received from analysis node.')
      }

      toast.success('Code analysis task successfully queued')
      setActiveStatusId(statusId)
    } catch (err) {
      toast.error(err.message || 'AI compilation request failed.')
    }
  }

  // Group metrics data
  const totalReviews = overviewData?.totalReviews ?? 0
  const totalIssues = overviewData?.totalIssues ?? 0
  const avgHealth = Math.max(0, Math.round(100 - (overviewData?.averageRiskScore ?? 0)))

  // Slice reviews safely from paginated structure
  const recentReviews = reviewsData?.reviews || []

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <CyberBadge pulse className="mb-4">AI Code Review Engine</CyberBadge>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 neon-text">Review Dashboard</h1>
        <p className="text-muted-foreground">Paste, upload, or edit code for instant AI-powered analysis.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard depth className="p-0 overflow-hidden">
            <div className="flex border-b border-white/10">
              {[
                { id: 'editor', label: 'Code Editor' },
                { id: 'upload', label: 'Upload File' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'upload' ? (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <UploadZone
                      onFileLoad={(content) => {
                        setCode(content)
                        setActiveTab('editor')
                        toast.success('File loaded')
                      }}
                      className="mb-4"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {activeTab === 'editor' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-end mb-3">
                    <Button variant="outline" size="sm" onClick={async () => {
                      try {
                        setCode(await navigator.clipboard.readText())
                        toast.success('Pasted from clipboard')
                      } catch { toast.error('Clipboard access denied') }
                    }}>
                      <ClipboardPaste className="h-4 w-4" /> Paste
                    </Button>
                  </div>
                  <MonacoEditorPanel
                    code={code}
                    onChange={setCode}
                    language={language}
                    onLanguageChange={setLanguage}
                    scanning={!!activeStatusId || analyzeMutation.isPending}
                  />
                </motion.div>
              )}

              <div className="flex justify-end mt-4 gap-3">
                <GlowButton onClick={handleAnalyze} disabled={!!activeStatusId || analyzeMutation.isPending}>
                  <Sparkles className="h-4 w-4" />
                  {activeStatusId || analyzeMutation.isPending ? 'Analyzing...' : 'Analyze Code'}
                </GlowButton>
              </div>
            </div>
          </GlassCard>

          <AnimatePresence>
            {activeStatusId && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AIReviewLoader
                  active={!!activeStatusId}
                  progress={statusData?.progress ?? 0}
                  currentStage={statusData?.status ?? 'queued'}
                  logs={statusData?.logs ?? []}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <GlassCard depth>
            <h3 className="text-sm font-semibold mb-4 text-primary">Live Metrics</h3>
            {[
              { label: 'Total Reviews', value: totalReviews },
              { label: 'Issues Found', value: totalIssues },
              { label: 'Avg. Health', value: `${avgHealth}%` },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-bold text-primary">{s.value}</span>
              </motion.div>
            ))}
          </GlassCard>

          <GlassCard className="border-amber-500/20">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Select the correct language for more accurate security and performance analysis.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Recent Reviews
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {reviewsLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : recentReviews.length === 0 ? (
          <GlassCard className="text-center py-12 text-muted-foreground text-sm border-dashed border-white/5 bg-slate-950/20">
            No reviews yet. Submit some code to view your telemetry.
          </GlassCard>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-4">
            {recentReviews.slice(0, 4).map((review, i) => (
              <ReviewCard
                key={review._id || review.id}
                review={review}
                index={i}
                onClick={() => navigate(`/review/${review._id || review.id}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

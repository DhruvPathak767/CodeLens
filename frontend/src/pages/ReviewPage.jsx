import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, FileText, FileCode, Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedLoader } from '@/components/common/AnimatedLoader'
import { CodeBlock } from '@/components/common/CodeBlock'
import { RiskScoreCard } from '@/components/review/RiskScoreCard'
import { ReviewTabs } from '@/components/review/ReviewTabs'
import { useReviewDetailQuery, useBookmarkMutation } from '@/hooks/useReviewsQuery'
import { exportService } from '@/services/exportService'
import toast from 'react-hot-toast'

export default function ReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exporting, setExporting] = useState(false)

  // React Query queries & mutations
  const { data: review, isLoading, error } = useReviewDetailQuery(id)
  const bookmarkMutation = useBookmarkMutation()

  const handleExport = async (format) => {
    setExporting(true)
    try {
      await exportService.downloadReport(id, format)
      toast.success(`Exported ${format.toUpperCase()} report successfully`)
    } catch (err) {
      toast.error(`Export failed: ${err.message || 'Error occurred'}`)
    } finally {
      setExporting(false)
    }
  }

  const handleToggleBookmark = async () => {
    if (!review) return
    const reviewId = review._id || review.id
    const currentBookmarkState = !!review.isBookmarked
    
    try {
      await bookmarkMutation.mutateAsync({
        id: reviewId,
        isBookmarked: currentBookmarkState,
      })
      toast.success(currentBookmarkState ? 'Bookmark removed' : 'Bookmark saved')
    } catch {
      toast.error('Failed to update bookmark status')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <AnimatedLoader size="lg" text="Loading AI review..." />
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Review report not found</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    )
  }

  const results = review.reviewResults || []
  
  const issuesGrouped = {
    security: [],
    performance: [],
    'best-practices': [],
    scalability: []
  }

  results.forEach((issue) => {
    const categoryLower = String(issue.category || 'security').toLowerCase().replace(' ', '-')
    if (issuesGrouped[categoryLower]) {
      issuesGrouped[categoryLower].push(issue)
    } else {
      issuesGrouped.security.push(issue)
    }
  })

  const counts = {
    critical: results.filter((i) => String(i.severity).toLowerCase() === 'critical').length,
    warning: results.filter((i) => String(i.severity).toLowerCase() === 'warning').length,
    suggestion: results.filter((i) => String(i.severity).toLowerCase() === 'suggestion').length,
  }

  const isBookmarked = !!review.isBookmarked

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-6"
      >
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">
            {review.projectName || 'Untitled Review'}
            <span className="text-sm font-normal text-muted-foreground capitalize ml-2">({review.language})</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="w-44">
            <RiskScoreCard 
              score={review.riskScore !== undefined ? Math.max(0, Math.round(100 - review.riskScore)) : 100} 
              {...counts} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleBookmark}
              disabled={bookmarkMutation.isPending}
              className={isBookmarked ? 'border-primary/50 text-primary bg-primary/5' : 'border-border'}
            >
              <Bookmark className={`h-4 w-4 mr-1.5 ${isBookmarked ? 'fill-primary' : ''}`} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>

            <div className="flex flex-wrap items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border">
              <button
                onClick={() => handleExport('json')}
                disabled={exporting}
                title="Export JSON"
                className="p-2 rounded-lg text-xs hover:bg-muted/60 hover:text-primary transition-all flex items-center gap-1"
              >
                <FileCode className="h-3.5 w-3.5" /> JSON
              </button>
              <button
                onClick={() => handleExport('markdown')}
                disabled={exporting}
                title="Export Markdown"
                className="p-2 rounded-lg text-xs hover:bg-muted/60 hover:text-primary transition-all flex items-center gap-1"
              >
                <FileText className="h-3.5 w-3.5" /> MD
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                title="Export HTML Audit"
                className="p-2 rounded-lg text-xs hover:bg-muted/60 hover:text-primary transition-all flex items-center gap-1"
              >
                <Printer className="h-3.5 w-3.5" /> Audit Report
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Summary Banner */}
      {review.aiSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
        >
          <h3 className="font-semibold text-primary mb-2">Executive AI Review Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.aiSummary}</p>
        </motion.div>
      )}

      <ReviewTabs issues={issuesGrouped} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid lg:grid-cols-2 gap-6 pt-6 border-t border-white/10"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4">Original Code</h3>
          <CodeBlock code={review.originalCode} language={review.language} showLineNumbers />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">AI Suggested Optimization</h3>
          <CodeBlock
            code={review.optimizedCode || results[0]?.optimizedCode || review.originalCode}
            language={review.language}
            showLineNumbers
          />
        </div>
      </motion.div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, ArrowRight, Calendar, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { CyberBadge } from '@/components/common/CyberBadge'
import { Button } from '@/components/ui/Button'
import { useBookmarksListQuery, useBookmarkMutation } from '@/hooks/useReviewsQuery'
import { staggerContainer } from '@/animations/staggerVariants'
import toast from 'react-hot-toast'

export default function BookmarksPage() {
  const navigate = useNavigate()

  // Queries & Mutations powered by TanStack Query
  const { data: bookmarks = [], isLoading } = useBookmarksListQuery()
  const bookmarkMutation = useBookmarkMutation()

  const handleRemoveBookmark = async (e, id) => {
    e.stopPropagation()
    try {
      await bookmarkMutation.mutateAsync({
        id,
        isBookmarked: true // Pass true to indicate we are unbookmarking
      })
      toast.success('Removed from bookmarks')
    } catch {
      toast.error('Failed to remove bookmark')
    }
  }

  return (
    <div className="space-y-8 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <CyberBadge className="mb-4">Saved Analyses</CyberBadge>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 neon-text">Bookmarks</h1>
        <p className="text-muted-foreground">Access your pinned and critical code reviews quickly.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-dashed border-white/10">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
            <Bookmark className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No bookmarks saved yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Bookmark important reviews from your analysis results page to keep track of them here.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Start reviewing code
          </Button>
        </GlassCard>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {bookmarks.map((item, i) => {
            const reviewId = item._id || item.id
            return (
              <motion.div
                key={reviewId}
                whileHover={{ y: -6 }}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/review/${reviewId}`)}
              >
                <GlassCard depth className="h-full flex flex-col justify-between border-white/10 group-hover:border-primary/40 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <CyberBadge className="bg-primary/10 border-primary/20 text-primary">
                        {item.language}
                      </CyberBadge>
                      <button
                        onClick={(e) => handleRemoveBookmark(e, reviewId)}
                        disabled={bookmarkMutation.isPending}
                        className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-white/5 transition-all disabled:opacity-50"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-primary transition-colors">
                      {item.projectName || 'Untitled Scan'}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                      {item.aiSummary || 'No summary available.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-t-white/5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                      Inspect <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

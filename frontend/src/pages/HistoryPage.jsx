import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, FileCode, Clock, Shield } from 'lucide-react'
import { CyberBadge } from '@/components/common/CyberBadge'
import { SearchBar } from '@/components/common/SearchBar'
import { FilterDropdown } from '@/components/common/FilterDropdown'
import { StatsCard } from '@/components/common/StatsCard'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedLoader } from '@/components/common/AnimatedLoader'
import { ReviewCard } from '@/components/dashboard/ReviewCard'
import { useReviewsListQuery } from '@/hooks/useReviewsQuery'
import { useDashboardOverviewQuery, useDashboardLanguagesQuery } from '@/hooks/useDashboardQuery'
import { staggerContainer } from '@/animations/staggerVariants'
import { LANGUAGES } from '@/utils/constants'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [filterLang, setFilterLang] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const navigate = useNavigate()

  // Map local sorting codes to backend-specific sort parameters
  const backendSort = sortBy === 'score' ? 'risk-high' : 'newest'

  // Standard TanStack query for paginated review logs search
  const { data: reviewsData, isLoading: historyLoading } = useReviewsListQuery({
    search: search.trim() || undefined,
    language: filterLang || undefined,
    sort: backendSort
  })

  // Standard TanStack query for live database metrics
  const { data: overview } = useDashboardOverviewQuery()
  const { data: languagesData } = useDashboardLanguagesQuery()

  // Safe variables parsing
  const reviews = reviewsData?.reviews || []
  const totalReviews = overview?.totalReviews ?? 0
  const totalIssues = overview?.totalIssues ?? 0
  const avgScore = Math.max(0, Math.round(100 - (overview?.averageRiskScore ?? 0)))
  const uniqueLanguages = languagesData?.length ?? 0

  return (
    <div className="space-y-8 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <CyberBadge className="mb-4">Review Archive</CyberBadge>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Review History</h1>
        <p className="text-muted-foreground">Browse, search, and analyze your past code reviews.</p>
      </motion.div>

      {/* Real Statistics Telemetry HUD */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Reviews" value={totalReviews} icon={FileCode} index={0} />
        <StatsCard label="Issues Found" value={totalIssues} icon={Filter} color="text-amber-400" index={1} />
        <StatsCard label="Avg. Health" value={`${avgScore}%`} icon={Clock} color="text-emerald-400" index={2} />
        <StatsCard label="Languages" value={uniqueLanguages} icon={Shield} color="text-secondary" index={3} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..." />
        </div>
        <FilterDropdown
          value={filterLang}
          onChange={setFilterLang}
          options={[{ value: '', label: 'All Languages' }, ...LANGUAGES]}
        />
        <FilterDropdown
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'score', label: 'Highest Score' },
          ]}
        />
      </div>

      {historyLoading ? (
        <div className="flex justify-center py-20">
          <AnimatedLoader text="Loading history..." />
        </div>
      ) : reviews.length === 0 ? (
        <GlassCard className="text-center py-16">
          <Filter className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No reviews found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </GlassCard>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-4">
          {reviews.map((review, i) => (
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
  )
}

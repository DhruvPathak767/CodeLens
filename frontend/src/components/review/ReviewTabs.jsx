import { Shield, Zap, CheckCircle, TrendingUp } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { IssueCard } from './IssueCard'
import { GlassCard } from '@/components/common/GlassCard'
import { motion } from 'framer-motion'
import { staggerContainer } from '@/animations/staggerVariants'
import { REVIEW_CATEGORIES } from '@/utils/constants'

const iconMap = { Shield, Zap, CheckCircle, TrendingUp }

export function ReviewTabs({ issues }) {
  const defaultTab = REVIEW_CATEGORIES[0]?.id || 'security'

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="flex-wrap h-auto gap-1 p-1.5 bg-muted/40 border border-border">
        {REVIEW_CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon]
          const count = issues?.[cat.id]?.length || 0
          return (
            <TabsTrigger key={cat.id} value={cat.id} className="gap-2 px-4">
              <Icon className="h-4 w-4" />
              {cat.label}
              <span className="text-xs opacity-60">({count})</span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {REVIEW_CATEGORIES.map((cat) => (
        <TabsContent key={cat.id} value={cat.id}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4 mt-2">
            {(issues?.[cat.id] || []).length === 0 ? (
              <GlassCard className="text-center py-12">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <p className="font-medium">All clear in {cat.label}</p>
                <p className="text-sm text-muted-foreground">No issues detected in this category</p>
              </GlassCard>
            ) : (
              issues[cat.id].map((issue, i) => <IssueCard key={issue.id} issue={issue} index={i} />)
            )}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  TrendingUp, ShieldAlert, Code, 
  RefreshCw, Zap, Bug, Award
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { GlassCard } from '@/components/common/GlassCard'
import { CyberBadge } from '@/components/common/CyberBadge'
import { Button } from '@/components/ui/Button'
import {
  useDashboardOverviewQuery,
  useDashboardActivityQuery,
  useDashboardLanguagesQuery,
  useDashboardSeverityQuery,
  useDashboardTrendsQuery
} from '@/hooks/useDashboardQuery'
import { staggerContainer, staggerItem } from '@/animations/staggerVariants'
import toast from 'react-hot-toast'

const COLORS = ['#ef4444', '#eab308', '#3b82f6', '#10b981'] // Red, Yellow, Blue, Green
const PIE_COLORS = ['#ef4444', '#f59e0b', '#22d3ee'] // Critical, Warning, Suggestion

export default function AnalyticsPage() {
  const queryClient = useQueryClient()

  // Centralized TanStack Queries for MongoDB aggregates
  const { data: overview, isLoading: oLoading } = useDashboardOverviewQuery()
  const { data: activity = [], isLoading: aLoading } = useDashboardActivityQuery()
  const { data: languages = [], isLoading: lLoading } = useDashboardLanguagesQuery()
  const { data: severity, isLoading: sLoading } = useDashboardSeverityQuery()
  const { data: trends = [], isLoading: tLoading } = useDashboardTrendsQuery()

  const loading = oLoading || aLoading || lLoading || sLoading || tLoading

  const handleRefresh = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Diagnostics telemetry refreshed')
    } catch {
      toast.error('Failed to reload aggregates')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-mono">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Querying database aggregates...</p>
      </div>
    )
  }

  // Format severity object into Recharts array format
  const severityData = severity ? [
    { name: 'Critical', value: severity.Critical || 0 },
    { name: 'Warning', value: severity.Warning || 0 },
    { name: 'Suggestion', value: severity.Suggestion || 0 },
  ].filter(d => d.value > 0) : []

  return (
    <div className="space-y-8 relative font-sans">
      {/* Top action header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <CyberBadge pulse className="mb-4">Engineering Intelligence</CyberBadge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 neon-text">Analytics Telemetry</h1>
          <p className="text-muted-foreground text-sm">Aggregated SaaS operational statistics, language distributions, and code risk trends.</p>
        </motion.div>
        
        <Button variant="outline" size="sm" onClick={handleRefresh} className="w-fit self-end border-border hover:border-primary/30">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh Diagnostics
        </Button>
      </div>

      {/* 1. Overview Dashboard cards */}
      {overview && (
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Audits Run', value: overview.totalReviews, desc: 'Reviews compiled', icon: Code, color: 'text-cyan-400' },
            { label: 'Identified Code Flaws', value: overview.totalIssues, desc: 'Issues detected', icon: Bug, color: 'text-amber-400' },
            { label: 'Avg Risk Rating', value: `${overview.averageRiskScore}/100`, desc: 'Capped safety index', icon: ShieldAlert, color: 'text-red-400' },
            { label: 'System Health Status', value: overview.systemStatus || 'Good', desc: 'Aggregated safety grade', icon: Award, color: 'text-emerald-400' },
          ].map((card, i) => {
            const CardIcon = card.icon
            return (
              <motion.div key={card.label} variants={staggerItem}>
                <GlassCard depth className="p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{card.label}</span>
                    <CardIcon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">{card.value}</div>
                  <span className="text-xs text-muted-foreground font-mono">{card.desc}</span>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* 2. Visual Graphs Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Weekly Risk score & Reviews volume trends */}
        <GlassCard depth className="lg:col-span-2 p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" /> Audit Scan Trends
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Historical Week-over-Week Metrics</span>
          </div>
          
          <div className="flex-1 w-full min-h-[300px]">
            {trends.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-xs">No trend records compiled yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                  <Area name="Average Risk Rating" type="monotone" dataKey="avgRiskScore" stroke="#ef4444" fillOpacity={1} fill="url(#riskGrad)" strokeWidth={2} />
                  <Area name="Audited Files Volume" type="monotone" dataKey="reviewsCount" stroke="#22d3ee" fillOpacity={1} fill="url(#volGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Severity distribution Pie chart */}
        <GlassCard depth className="p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" /> Vulnerability Levels
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Severities Breakdown</span>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center items-center relative min-h-[300px]">
            {severityData.length === 0 ? (
              <div className="text-muted-foreground font-mono text-xs">No vulnerabilities recorded yet.</div>
            ) : (
              <>
                <div className="h-[220px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Glowing center indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold tracking-tight text-foreground">{overview?.totalIssues || 0}</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Total Issues</span>
                  </div>
                </div>
                {/* Labels and legends */}
                <div className="w-full flex justify-around text-xs font-mono mt-4">
                  {severityData.map((d, i) => (
                    <div key={d.name} className="flex flex-col items-center">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} /> {d.name}
                      </span>
                      <span className="font-bold text-foreground mt-1">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </GlassCard>

        {/* 3. Programming languages usage metrics chart */}
        <GlassCard depth className="lg:col-span-3 p-6 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-400" /> Language Metrics
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Volume & Risk Ratings per Language</span>
          </div>

          <div className="flex-1 w-full min-h-[250px]">
            {languages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-xs">No language records compiled.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="language" stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                  <Bar name="Audits Count" dataKey="reviewCount" fill="#22d3ee" radius={[4, 4, 0, 0]}>
                    {languages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <Bar name="Average Risk Rating" dataKey="averageRiskScore" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

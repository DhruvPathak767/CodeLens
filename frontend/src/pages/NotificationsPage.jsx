import { motion } from 'framer-motion'
import { Bell, Check, Eye, Trash, BellOff, AlertOctagon, ShieldAlert, Settings, Info } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { CyberBadge } from '@/components/common/CyberBadge'
import { Button } from '@/components/ui/Button'
import { useNotifications } from '@/context/NotificationContext'
import { staggerContainer } from '@/animations/staggerVariants'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const getIcon = (type) => {
    switch (type) {
      case 'critical_issue':
        return <ShieldAlert className="h-5 w-5 text-red-400" />
      case 'review_completed':
        return <Check className="h-5 w-5 text-emerald-400" />
      case 'system':
        return <Settings className="h-5 w-5 text-purple-400" />
      default:
        return <Info className="h-5 w-5 text-cyan-400" />
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to update notifications')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CyberBadge className="mb-4">System Telemetry Logs</CyberBadge>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 neon-text">Notification Center</h1>
          <p className="text-muted-foreground">Monitor real-time engine analysis outputs and platform logs.</p>
        </motion.div>

        {notifications.length > 0 && unreadCount > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="border-cyan-500/20 hover:border-cyan-500/50">
              <Check className="h-4 w-4 mr-2 text-cyan-400" /> Mark All as Read
            </Button>
          </motion.div>
        )}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-dashed border-white/10">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
            <BellOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Workspace quiet</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            All caught up! New AI compilation logs and alerts will appear here in real time.
          </p>
        </GlassCard>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {notifications.map((n, i) => (
            <motion.div
              key={n._id || n.id}
              whileHover={{ x: 4 }}
              className="relative transition-all"
            >
              <GlassCard
                depth
                className={`flex gap-4 p-4 border border-border hover:border-cyan-500/20 transition-all ${
                  !n.isRead
                    ? 'bg-gradient-to-r from-cyan-500/5 to-transparent border-l-2 border-l-cyan-500 shadow-lg shadow-cyan-500/5'
                    : 'opacity-70'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${
                  !n.isRead ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-muted/30 border border-border'
                }`}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h4 className={`font-semibold text-sm ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {n.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {n.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id || n.id)}
                        className="p-1 rounded bg-muted/40 hover:bg-cyan-500/10 hover:text-cyan-400 border border-border transition-all"
                        title="Mark as Read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

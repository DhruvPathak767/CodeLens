import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { User, Bell, Palette, Save, RefreshCw } from 'lucide-react'
import { GlowButton } from '@/components/common/GlowButton'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { GlassCard } from '@/components/common/GlassCard'
import { CyberBadge } from '@/components/common/CyberBadge'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { settingsService } from '@/services/settingsService'
import { fadeInUp } from '@/animations/staggerVariants'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const queryClient = useQueryClient()
  const [profile, setProfile] = useState({ name: user?.name || 'Developer', email: user?.email || 'dev@codelens.ai' })

  // Sync state with user profile updates
  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email })
    }
  }, [user])

  // React Query queries for profile preferences
  const { data: settings = {}, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
    staleTime: 60000,
  })

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Configuration settings updated successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save settings changes')
    }
  })

  const handleSaveProfile = () => {
    updateSettingsMutation.mutate({
      name: profile.name
    })
  }

  const handleSavePreferenceToggle = (key, value) => {
    const updated = {
      emailReviews: settings.emailReviews ?? true,
      emailCritical: settings.emailCritical ?? true,
      pushEnabled: settings.pushEnabled ?? false,
      weeklyDigest: settings.weeklyDigest ?? true,
      [key]: value
    }
    updateSettingsMutation.mutate(updated)
  }

  if (settingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-mono">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Querying configurations...</p>
      </div>
    )
  }

  const sections = [
    {
      icon: User, title: 'Profile', desc: 'Account information',
      content: (
        <div className="space-y-4 font-sans">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block text-opacity-80">Email (Read-Only)</label>
            <Input 
              type="email" 
              value={profile.email} 
              disabled 
              className="cursor-not-allowed opacity-60 bg-white/5 border-white/5" 
            />
          </div>
          <GlowButton size="md" onClick={handleSaveProfile} disabled={updateSettingsMutation.isPending}>
            <Save className="h-4 w-4" /> Save Profile
          </GlowButton>
        </div>
      ),
    },
    {
      icon: Palette, title: 'Appearance', desc: 'Theme and display',
      content: (
        <div className="flex items-center justify-between font-sans">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground">Current: {theme}</p>
          </div>
          <ThemeToggle />
        </div>
      ),
    },

    {
      icon: Bell, title: 'Notifications', desc: 'Alert preferences',
      content: (
        <div className="space-y-4 font-sans">
          {[
            { key: 'emailReviews', label: 'Email on review completion' },
            { key: 'emailCritical', label: 'Email on critical issues' },
            { key: 'pushEnabled', label: 'Browser push notifications' },
            { key: 'weeklyDigest', label: 'Weekly digest summary' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <Switch
                checked={settings[item.key] ?? true}
                onCheckedChange={(v) => handleSavePreferenceToggle(item.key, v)}
              />
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8 max-w-3xl font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <CyberBadge className="mb-4">System Configuration</CyberBadge>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, API, and notification preferences.</p>
      </motion.div>

      {sections.map((section, i) => (
        <motion.div key={section.title} variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: i * 0.08 }}>
          <GlassCard depth>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.desc}</p>
              </div>
            </div>
            {section.content}
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}

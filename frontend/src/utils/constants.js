export const APP_NAME = 'CodeLens AI'
export const APP_TAGLINE = 'Intelligent Code Review for Modern Teams'

export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
]

export const SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  SUGGESTION: 'suggestion',
}

export const REVIEW_CATEGORIES = [
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'performance', label: 'Performance', icon: 'Zap' },
  { id: 'best-practices', label: 'Best Practices', icon: 'CheckCircle' },
  { id: 'scalability', label: 'Scalability', icon: 'TrendingUp' },
]

export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#demo', label: 'Demo' },
  { href: '#testimonials', label: 'Testimonials' },
]

export const SIDEBAR_LINKS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/history', label: 'History', icon: 'History' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/snippets', label: 'Snippets', icon: 'Terminal' },
  { path: '/bookmarks', label: 'Bookmarks', icon: 'Bookmark' },
  { path: '/notifications', label: 'Notifications', icon: 'Bell' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
]

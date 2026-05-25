import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlowButton } from '@/components/common/GlowButton'
import { AuthPanel } from '@/components/auth/AuthPanel'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Forgot password flow states
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Dynamically load Google GSI SDK script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1068228228308-g92j0v0l8k8k8k8.apps.googleusercontent.com',
          callback: handleGoogleCallback,
          auto_select: false,
        })
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn-div'),
          { 
            theme: 'filled_black', 
            size: 'large', 
            width: '280', 
            text: 'continue_with',
            shape: 'rectangular',
          }
        )
      }
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleGoogleCallback = async (response) => {
    if (!response.credential) return
    setLoading(true)
    try {
      await googleLogin(response.credential)
      toast.success('Signed in via Google successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Google OAuth authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login({ email, password })
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!resetEmail) { toast.error('Please enter your email address'); return }
    setResetLoading(true)
    
    try {
      await authService.forgotPassword(resetEmail)
      toast.success(`A password reset link has been dispatched to ${resetEmail}`)
      setForgotPasswordMode(false)
      setResetEmail('')
    } catch (err) {
      toast.error(err.message || 'Failed to request password reset link')
    } finally {
      setResetLoading(false)
    }
  }

  // Render password reset layout if triggered
  if (forgotPasswordMode) {
    return (
      <AuthPanel title="Reset Password" subtitle="Enter your email to retrieve your access credentials">
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@company.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <GlowButton type="submit" className="w-full" disabled={resetLoading}>
            {resetLoading ? 'Dispatching link...' : <>Send Reset Link <ArrowRight className="h-4 w-4" /></>}
          </GlowButton>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-xs text-muted-foreground hover:text-foreground mt-2"
            onClick={() => {
              setForgotPasswordMode(false)
              setResetEmail('')
            }}
          >
            Back to Sign In
          </Button>
        </form>
      </AuthPanel>
    )
  }

  return (
    <AuthPanel title="Welcome Back" subtitle="Sign in to your AI review workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm text-muted-foreground block">Password</label>
            <button
              type="button"
              onClick={() => setForgotPasswordMode(true)}
              className="text-xs text-primary hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
          </div>
        </div>
        <GlowButton type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : <>Sign In <ArrowRight className="h-4 w-4" /></>}
        </GlowButton>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account? <Link to="/auth/signup" className="text-primary hover:underline font-medium">Sign up</Link>
      </p>
      
      {/* Official secure GSI Google Sign-in button wrapped with premium visual style */}
      <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Or authenticate with Google</span>
        <div className="relative w-full max-w-[280px] flex justify-center group">
          {/* Subtle neon glow behind the button */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
          <div id="google-signin-btn-div" className="w-full relative z-10"></div>
        </div>
      </div>
    </AuthPanel>
  )
}

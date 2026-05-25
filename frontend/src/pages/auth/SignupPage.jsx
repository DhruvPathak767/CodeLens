import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlowButton } from '@/components/common/GlowButton'
import { AuthPanel } from '@/components/auth/AuthPanel'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signup, googleLogin } = useAuth()
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
          document.getElementById('google-signup-btn-div'),
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/
    
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (!passwordRegex.test(password)) {
      toast.error('Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character')
      return
    }
    setLoading(true)
    try {
      await signup({ name, email, password })
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPanel title="Create Account" subtitle="Start reviewing code with AI today" accent="purple">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Jane Developer" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="password" 
              placeholder="Min. 8 chars (A-Z, a-z, 0-9, special)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </div>
        <GlowButton type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : <>Create Account <ArrowRight className="h-4 w-4" /></>}
        </GlowButton>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account? <Link to="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>

      {/* Official GSI Google Sign-in button wrapped with premium visual style */}
      <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Or authenticate with Google</span>
        <div className="relative w-full max-w-[280px] flex justify-center group">
          {/* Subtle neon glow behind the button */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
          <div id="google-signup-btn-div" className="w-full relative z-10"></div>
        </div>
      </div>
    </AuthPanel>
  )
}

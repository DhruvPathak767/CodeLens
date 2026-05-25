import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { GlowButton } from '@/components/common/GlowButton'
import { AuthPanel } from '@/components/auth/AuthPanel'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (!passwordRegex.test(password)) {
      toast.error('Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      toast.success('Password reset successful! Please sign in with your new password.')
      navigate('/auth/login')
    } catch (err) {
      toast.error(err.message || 'Failed to reset password. The link may be invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPanel title="Secure New Password" subtitle="Configure a fresh access credential for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Min. 8 chars (A-Z, a-z, 0-9, special)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Min. 8 chars (A-Z, a-z, 0-9, special)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        <GlowButton type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating password...' : <>Update Password <ArrowRight className="h-4 w-4" /></>}
        </GlowButton>
      </form>
    </AuthPanel>
  )
}

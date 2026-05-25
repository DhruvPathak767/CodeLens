import { createContext, useContext } from 'react'
import { useProfileQuery, useLoginMutation, useGoogleLoginMutation, useSignupMutation, useLogoutMutation } from '@/hooks/useAuthQuery'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const token = localStorage.getItem('auth_token')
  
  // Standard React Query for active user hydration
  const { data: user, isLoading } = useProfileQuery(!!token)

  const loginMutation = useLoginMutation()
  const googleLoginMutation = useGoogleLoginMutation()
  const signupMutation = useSignupMutation()
  const logoutMutation = useLogoutMutation()

  const login = async (credentials) => {
    return loginMutation.mutateAsync(credentials)
  }

  const googleLogin = async (idToken) => {
    return googleLoginMutation.mutateAsync(idToken)
  }

  const signup = async (userData) => {
    return signupMutation.mutateAsync(userData)
  }

  const logout = async () => {
    return logoutMutation.mutateAsync()
  }

  const value = {
    user: user || null,
    loading: isLoading,
    login,
    googleLogin,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

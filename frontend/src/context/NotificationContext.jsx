import { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notificationService'
import { useAuth } from '@/context/AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Standard TanStack query for central notification records with 15s polling
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 15000 : false, // Poll every 15s in the background
    staleTime: 5000,
  })

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousNotifications = queryClient.getQueryData(['notifications'])
      
      queryClient.setQueryData(['notifications'], (prev) =>
        (prev || []).map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      )
      return { previousNotifications }
    },
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previousNotifications = queryClient.getQueryData(['notifications'])
      
      queryClient.setQueryData(['notifications'], (prev) =>
        (prev || []).map((n) => ({ ...n, isRead: true }))
      )
      return { previousNotifications }
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const value = {
    notifications,
    loading: isLoading,
    unreadCount,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

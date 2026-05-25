import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '@/services/reviewService'

export function useReviewsListQuery(params = {}) {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewService.getReviews(params),
    staleTime: 10000,
  })
}

export function useReviewDetailQuery(id) {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => reviewService.getReviewById(id),
    enabled: !!id,
    staleTime: 60000, // Detailed reports can be cached longer
  })
}

export function useReviewStatusQuery(statusId, isPollingActive) {
  return useQuery({
    queryKey: ['reviewStatus', statusId],
    queryFn: async () => {
      const status = await reviewService.getReviewStatus(statusId)
      const logs = await reviewService.getReviewLogs(statusId)
      return { ...status, logs }
    },
    enabled: !!statusId && isPollingActive,
    refetchInterval: (query) => {
      const state = query.state.data
      if (state?.status === 'completed' || state?.status === 'failed') {
        return false
      }
      return 1500 // Poll every 1.5s in the background
    },
    staleTime: 0, // Always get freshest logs during progress
  })
}

export function useAnalyzeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUploadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewService.uploadCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    },
  })
}

export function useBookmarksListQuery() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: reviewService.getBookmarks,
    staleTime: 20000,
  })
}

export function useBookmarkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, isBookmarked }) => {
      if (isBookmarked) {
        return reviewService.unbookmarkReview(id)
      } else {
        return reviewService.bookmarkReview(id)
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['review', variables.id] })
    },
  })
}

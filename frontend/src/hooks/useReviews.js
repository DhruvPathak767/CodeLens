import { useState, useEffect, useCallback } from 'react'
import { reviewService } from '@/services/reviewService'

export function useReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await reviewService.getReviews()
      setReviews(data)
    } catch (err) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, loading, error, refetch: fetchReviews }
}

export function useReview(id) {
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    reviewService
      .getReviewById(id)
      .then(setReview)
      .catch((err) => setError(err.message || 'Failed to load review'))
      .finally(() => setLoading(false))
  }, [id])

  return { review, loading, error }
}

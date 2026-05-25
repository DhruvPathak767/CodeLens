import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'

export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: dashboardService.getOverview,
    staleTime: 30000,
  })
}

export function useDashboardActivityQuery() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardService.getActivity,
    staleTime: 30000,
  })
}

export function useDashboardLanguagesQuery() {
  return useQuery({
    queryKey: ['dashboard', 'languages'],
    queryFn: dashboardService.getLanguages,
    staleTime: 30000,
  })
}

export function useDashboardSeverityQuery() {
  return useQuery({
    queryKey: ['dashboard', 'severity'],
    queryFn: dashboardService.getSeverityBreakdown,
    staleTime: 30000,
  })
}

export function useDashboardTrendsQuery() {
  return useQuery({
    queryKey: ['dashboard', 'trends'],
    queryFn: dashboardService.getTrends,
    staleTime: 30000,
  })
}

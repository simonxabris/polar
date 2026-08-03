import { api } from '@/utils/client'
import {
  getMetricsRangeDates,
  unwrap,
  type operations,
  type schemas,
} from '@polar-sh/client'
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

export type ChartRange = 'all_time' | '12m' | '3m' | '30d' | 'today'

export type ParsedMetricPeriod = schemas['MetricPeriod'] & {
  timestamp: Date
}

export interface ParsedMetricsResponse {
  periods: ParsedMetricPeriod[]
  totals: schemas['MetricsTotals']
  metrics: schemas['Metrics']
}

export const CHART_RANGES: Array<{ label: string; value: ChartRange }> = [
  { value: 'all_time', label: 'All Time' },
  { value: '12m', label: '12m' },
  { value: '3m', label: '3m' },
  { value: '30d', label: '30d' },
  { value: 'today', label: 'Today' },
]

export const DEFAULT_OVERVIEW_METRICS: Array<keyof schemas['Metrics']> = [
  'revenue',
  'monthly_recurring_revenue',
  'active_subscriptions',
  'orders',
  'checkouts_conversion',
]

const toISODate = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().split('T')[0]
}

const dateRangeToInterval = (
  startDate: Date,
  endDate: Date,
): schemas['TimeInterval'] => {
  if (differenceInYears(endDate, startDate) >= 3) return 'year'
  if (differenceInMonths(endDate, startDate) >= 4) return 'month'
  if (differenceInWeeks(endDate, startDate) > 4) return 'week'
  if (differenceInDays(endDate, startDate) > 1) return 'day'
  return 'hour'
}

const getRangeParameters = (
  range: ChartRange,
  createdAt: string,
): [Date, Date, schemas['TimeInterval']] => {
  const [startDate, endDate] = getMetricsRangeDates(range, { createdAt })
  return [startDate, endDate, dateRangeToInterval(startDate, endDate)]
}

export const useOverviewMetrics = (
  organization: schemas['OrganizationWithRole'],
) => {
  const storageKey = `overview_chart_range:${organization.id}`
  const [range, setRange] = useState<ChartRange>('30d')

  useEffect(() => {
    const storedRange = window.localStorage.getItem(storageKey)
    if (CHART_RANGES.some(({ value }) => value === storedRange)) {
      setRange(storedRange as ChartRange)
    }
  }, [storageKey])

  const updateRange = (value: ChartRange) => {
    setRange(value)
    window.localStorage.setItem(storageKey, value)
  }

  const metrics = useMemo(() => {
    const configured = organization.feature_settings?.overview_metrics ?? []
    return configured.length > 0
      ? (configured as Array<keyof schemas['Metrics']>)
      : DEFAULT_OVERVIEW_METRICS
  }, [organization.feature_settings?.overview_metrics])

  const [startDate, endDate, interval] = useMemo(
    () => getRangeParameters(range, organization.created_at),
    [organization.created_at, range],
  )
  const timezone = Intl.DateTimeFormat().resolvedOptions()
    .timeZone as operations['metrics:get']['parameters']['query']['timezone']

  const query = useQuery({
    queryKey: [
      'metrics',
      {
        startDate: toISODate(startDate),
        endDate: toISODate(endDate),
        interval,
        organizationId: organization.id,
        timezone,
        metrics,
      },
    ],
    queryFn: async (): Promise<ParsedMetricsResponse> => {
      const response = await unwrap(
        api.GET('/v1/metrics/', {
          params: {
            query: {
              organization_id: organization.id,
              start_date: toISODate(startDate),
              end_date: toISODate(endDate),
              interval,
              timezone,
              metrics,
            },
          },
        }),
      )
      return {
        ...response,
        periods: response.periods.map((period) => ({
          ...period,
          timestamp: new Date(period.timestamp),
        })) as ParsedMetricPeriod[],
      }
    },
  })

  return { ...query, interval, metrics, range, setRange: updateRange }
}

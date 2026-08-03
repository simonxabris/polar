import type { ParsedMetricsResponse } from '@/hooks/useOverviewMetrics'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import { formatCurrency } from '@polar-sh/currency'
import type { schemas } from '@polar-sh/client'
import { Button, Spinner } from '@polar-sh/orbit'
import FormattedDateTime from '@polar-sh/ui/components/atoms/FormattedDateTime'
import FormattedInterval from '@polar-sh/ui/components/atoms/FormattedInterval'
import ShadowBox from '@polar-sh/ui/components/atoms/ShadowBox'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ChartContainer,
  XAxis,
} from '@polar-sh/ui/components/ui/chart'
import { useTheme } from 'next-themes'
import { useId, useMemo } from 'react'
import type { MouseHandlerDataParam } from 'recharts'
import { twMerge } from 'tailwind-merge'

interface OverviewMetricCardProps {
  data?: ParsedMetricsResponse
  featured?: boolean
  hoveredPeriodIndex: number | null
  interval: schemas['TimeInterval']
  loading: boolean
  metric: keyof schemas['Metrics']
  onHoverPeriodChange: (index: number | null) => void
}

const stripTrailingZeros = (value: string) =>
  value.replace(/\.0+([^0-9]*)$/g, '$1')

const scalarFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatMetricValue = (metric: schemas['Metric'], value: number) => {
  switch (metric.type) {
    case 'currency':
      return formatCurrency('statistics')(value, 'usd')
    case 'currency_sub_cent':
      return formatCurrency('subcent')(value, 'usd')
    case 'percentage':
      return stripTrailingZeros(percentageFormatter.format(value))
    case 'scalar':
      return stripTrailingZeros(scalarFormatter.format(value))
  }
}

const timestampFormatter = (interval: schemas['TimeInterval'], value: Date) => {
  if (interval === 'hour') {
    return value.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  if (interval === 'month') {
    return value.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }
  if (interval === 'year') {
    return value.toLocaleDateString('en-US', { year: 'numeric' })
  }
  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  })
}

export const OverviewMetricCard = ({
  data,
  featured,
  hoveredPeriodIndex,
  interval,
  loading,
  metric,
  onHoverPeriodChange,
}: OverviewMetricCardProps) => {
  const { resolvedTheme } = useTheme()
  const id = useId()
  const selectedMetric = data?.metrics[metric]
  const hoveredPeriod =
    hoveredPeriodIndex === null ? undefined : data?.periods[hoveredPeriodIndex]
  const startDate = data?.periods.at(0)?.timestamp
  const endDate = data?.periods.at(-1)?.timestamp
  const metricValue = selectedMetric
    ? formatMetricValue(
        selectedMetric,
        Number(hoveredPeriod?.[metric] ?? data?.totals[metric] ?? 0),
      )
    : '0'
  const chartData = useMemo(
    () =>
      data?.periods.map((period) => ({
        timestamp: period.timestamp.toISOString(),
        current: Number(period[metric] ?? 0),
      })) ?? [],
    [data?.periods, metric],
  )

  const handleMouseMove = (state: MouseHandlerDataParam) => {
    const index = state.activeTooltipIndex
    const parsedIndex =
      typeof index === 'number'
        ? index
        : typeof index === 'string'
          ? Number.parseInt(index, 10)
          : null
    onHoverPeriodChange(
      parsedIndex === null || Number.isNaN(parsedIndex) ? null : parsedIndex,
    )
  }

  return (
    <ShadowBox
      className={twMerge(
        'dark:bg-polar-800 group relative flex w-full flex-col justify-between bg-gray-50 p-2 shadow-xs',
        'rounded-none! bg-transparent dark:bg-transparent',
        'dark:border-polar-700 border-t-0 border-r border-b border-l-0 border-gray-200 shadow-none',
        featured && 'lg:col-span-2',
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <div
        className={twMerge(
          'flex flex-row items-start justify-between gap-6 px-6 py-4',
          loading && 'invisible',
        )}
      >
        <div className="flex w-full min-w-0 flex-col gap-y-4">
          <h3 className="text-lg">{selectedMetric?.display_name}</h3>
          <h2 className="text-3xl xl:text-5xl xl:font-[350]">{metricValue}</h2>
          <div className="flex flex-col gap-x-6 gap-y-2 md:flex-row md:items-center">
            <div className="flex flex-row items-center gap-x-2 text-sm">
              <span className="h-3 w-3 rounded-full border-2 border-blue-500" />
              {hoveredPeriod ? (
                <FormattedDateTime
                  datetime={hoveredPeriod.timestamp}
                  dateStyle="medium"
                />
              ) : (
                <span className="dark:text-polar-500 text-gray-500">
                  {startDate && endDate && (
                    <FormattedInterval
                      startDatetime={startDate}
                      endDatetime={endDate}
                      hideCurrentYear={false}
                    />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex rounded-full transition-opacity md:opacity-0 md:group-hover:opacity-100"
          aria-label={`Actions for ${selectedMetric?.display_name ?? metric}`}
        >
          <MoreVertOutlined fontSize="small" />
        </Button>
      </div>
      <div className="dark:bg-polar-900 flex w-full flex-col gap-y-2 rounded-3xl bg-white">
        {loading ? (
          <div className="h-[200px]" />
        ) : data && selectedMetric ? (
          <ChartContainer
            style={{ height: 200, width: '100%' }}
            config={{ current: { label: 'Current Period', color: '#2563eb' } }}
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 24, right: 24, top: 24 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => onHoverPeriodChange(null)}
            >
              <defs>
                <linearGradient
                  id={`area-gradient-${id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-current)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-current)"
                    stopOpacity={0.025}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                horizontal={false}
                vertical
                stroke={resolvedTheme === 'dark' ? '#222225' : '#ccc'}
                strokeDasharray="6 6"
                syncWithTicks
              />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="equidistantPreserveStart"
                tickFormatter={(value: string) =>
                  timestampFormatter(interval, new Date(value))
                }
              />
              <Area
                dataKey="current"
                stroke="var(--color-current)"
                fill={`url(#area-gradient-${id})`}
                type="linear"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-lg">
            No data available
          </div>
        )}
      </div>
    </ShadowBox>
  )
}

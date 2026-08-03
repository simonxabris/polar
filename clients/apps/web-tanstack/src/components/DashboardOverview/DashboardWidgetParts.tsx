import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import RemoveOutlined from '@mui/icons-material/RemoveOutlined'
import type { schemas } from '@polar-sh/client'
import { formatCurrency } from '@polar-sh/currency'
import {
  Button,
  Status,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type StatusColor,
} from '@polar-sh/orbit'
import { Card } from '@polar-sh/ui/components/atoms/Card'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import {
  dashboardWidgetCellClassName,
  EmptyWidgetState,
  WidgetContainer,
} from './WidgetContainer'

const getTrend = (current: number, previous?: number) => {
  if (previous === undefined || (previous === 0 && current === 0)) return null
  if (previous === 0) return 1
  const trend = (current - previous) / Math.abs(previous)
  return Number.isFinite(trend) && trend !== 0 ? trend : null
}

export const RevenueWidget = ({
  periods,
  loading,
}: {
  periods: Array<
    Omit<schemas['MetricPeriod'], 'timestamp'> & { timestamp: Date }
  >
  loading: boolean
}) => {
  const maxRevenue = Math.max(
    1,
    ...periods.map((period) => period.revenue ?? 0),
  )

  return (
    <WidgetContainer
      title="Revenue"
      action={
        <span className="dark:text-polar-500 text-gray-500">Last 3 Months</span>
      }
      className={dashboardWidgetCellClassName}
    >
      <div className="grid flex-1 grid-cols-3 gap-4 pb-6">
        {periods.map((period, index) => {
          const revenue = period.revenue ?? 0
          const trend = getTrend(
            revenue,
            periods[index - 1]?.revenue ?? undefined,
          )
          return (
            <div
              key={period.timestamp.toISOString()}
              className="flex flex-col gap-y-2"
            >
              <Tooltip>
                <TooltipTrigger className="relative min-h-48 flex-1 overflow-hidden rounded-lg bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_2px,transparent_2px,transparent_8px)]">
                  {!loading && (
                    <div
                      className={twMerge(
                        'absolute bottom-0 w-full rounded-lg',
                        index === periods.length - 1
                          ? 'bg-indigo-400 dark:bg-indigo-700'
                          : 'dark:bg-polar-700 bg-gray-400',
                      )}
                      style={{ height: `${(revenue / maxRevenue) * 100}%` }}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {formatCurrency('compact')(revenue, 'usd')} in{' '}
                  {format(period.timestamp, 'MMMM')}
                </TooltipContent>
              </Tooltip>
              <div className="flex flex-col text-left">
                <span className="text-sm">
                  {format(period.timestamp, 'MMMM')}
                </span>
                <div className="flex flex-row items-center justify-between gap-x-2">
                  <span className="dark:text-polar-500 text-sm text-gray-500">
                    {formatCurrency('statistics')(revenue, 'usd')}
                  </span>
                  <span
                    className={twMerge(
                      'flex flex-row items-center gap-x-1 rounded-xs p-0.5 text-xs',
                      trend === null
                        ? 'dark:bg-polar-700 dark:text-polar-500 bg-gray-100 text-gray-500'
                        : trend > 0
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60'
                          : 'bg-red-100 text-red-600 dark:bg-red-950/60',
                    )}
                  >
                    {trend === null ? (
                      <RemoveOutlined fontSize="inherit" />
                    ) : trend > 0 ? (
                      <KeyboardArrowUp fontSize="inherit" />
                    ) : (
                      <KeyboardArrowDown fontSize="inherit" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </WidgetContainer>
  )
}

const orderStatusColor = (
  status: schemas['Order']['status'],
): StatusColor | undefined => {
  if (status === 'paid') return 'green'
  if (status === 'pending') return 'yellow'
  if (status === 'refunded' || status === 'partially_refunded') return 'purple'
}

export const OrdersWidget = ({ orders }: { orders: schemas['Order'][] }) => (
  <WidgetContainer
    title="Latest Orders"
    action={
      <Button
        variant="secondary"
        size="sm"
        className="rounded-full border-none"
      >
        View All
      </Button>
    }
    className={twMerge('min-h-80', dashboardWidgetCellClassName)}
  >
    {orders.length > 0 ? (
      <div className="flex flex-col gap-y-2 pb-6">
        {orders.map((order) => {
          const createdAt = new Date(order.created_at)
          return (
            <Card
              key={order.id}
              className="dark:bg-polar-800 flex flex-col gap-y-1 rounded-xl border-none bg-gray-50 px-4 py-4 transition-opacity hover:opacity-60"
            >
              <div className="dark:text-polar-500 flex flex-row items-baseline justify-between text-sm text-gray-500">
                <span>
                  {createdAt.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    hour12: false,
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>
                <Status
                  color={orderStatusColor(order.status)}
                  size="small"
                  status={order.status
                    .split('_')
                    .map((word) =>
                      word.charAt(0).toUpperCase().concat(word.slice(1)),
                    )
                    .join(' ')}
                />
              </div>
              <div className="flex flex-row justify-between gap-x-4">
                <h3 className="min-w-0 truncate">{order.description}</h3>
                <span>
                  {formatCurrency('standard')(order.net_amount, order.currency)}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    ) : (
      <EmptyWidgetState
        title="No orders found"
        description="Your most recent orders will appear here."
      />
    )}
  </WidgetContainer>
)

export const AccountWidget = ({
  balance,
  payouts,
}: {
  balance: string
  payouts: schemas['Payout'][]
}) => (
  <WidgetContainer
    title="Available balance"
    action={<h2 className="text-lg">{balance}</h2>}
    className={dashboardWidgetCellClassName}
  >
    {payouts.length > 0 ? (
      <div className="flex flex-col gap-y-2 pb-6">
        {payouts.map((payout) => (
          <Card
            key={payout.id}
            className="dark:bg-polar-800 flex flex-col gap-y-1 rounded-xl border-none bg-gray-50 px-4 py-4"
          >
            <div className="flex flex-row justify-between">
              <h3>Payout</h3>
              <span>
                {formatCurrency('compact')(payout.amount, payout.currency)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <EmptyWidgetState
        title="No payouts yet"
        description="You may only withdraw funds above $10."
      />
    )}
  </WidgetContainer>
)

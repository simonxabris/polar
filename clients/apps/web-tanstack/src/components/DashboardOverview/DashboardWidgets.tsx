import { useDashboardWidgets } from '@/hooks/useDashboardWidgets'
import type { schemas } from '@polar-sh/client'
import { formatCurrency } from '@polar-sh/currency'
import {
  AccountWidget,
  OrdersWidget,
  RevenueWidget,
} from './DashboardWidgetParts'

export const DashboardWidgets = ({
  organization,
}: {
  organization: schemas['OrganizationWithRole']
}) => {
  const { orders, payouts, revenue, summary } =
    useDashboardWidgets(organization)
  const availableBalance = formatCurrency('compact')(
    summary.data?.available_balance.amount ?? 0,
    summary.data?.available_balance.currency ?? 'usd',
  )

  return (
    <div className="dark:border-polar-700 overflow-hidden rounded-xl border border-gray-200">
      <div className="grid grid-cols-1 [clip-path:inset(1px_1px_1px_1px)] lg:grid-cols-3">
        <RevenueWidget
          periods={revenue.data ?? []}
          loading={revenue.isLoading}
        />
        <OrdersWidget orders={orders.data?.items ?? []} />
        <AccountWidget
          balance={availableBalance}
          payouts={payouts.data?.items ?? []}
        />
      </div>
    </div>
  )
}

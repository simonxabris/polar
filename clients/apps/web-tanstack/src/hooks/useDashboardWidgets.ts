import { api } from '@/utils/client'
import { unwrap, type operations, type schemas } from '@polar-sh/client'
import { useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'

const toISODate = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().split('T')[0]
}

export const useDashboardWidgets = (
  organization: schemas['OrganizationWithRole'],
) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions()
    .timeZone as operations['metrics:get']['parameters']['query']['timezone']

  const revenue = useQuery({
    queryKey: ['dashboard-widget-revenue', organization.id, timezone],
    queryFn: async () => {
      const response = await unwrap(
        api.GET('/v1/metrics/', {
          params: {
            query: {
              organization_id: organization.id,
              start_date: toISODate(startOfMonth(subMonths(new Date(), 2))),
              end_date: toISODate(endOfMonth(new Date())),
              interval: 'month',
              timezone,
              metrics: ['revenue'],
            },
          },
        }),
      )
      return response.periods.map((period) => ({
        ...period,
        timestamp: new Date(period.timestamp),
      }))
    },
    enabled: organization.permissions.includes('analytics:read'),
  })

  const orders = useQuery({
    queryKey: ['dashboard-widget-orders', organization.id],
    queryFn: () =>
      unwrap(
        api.GET('/v1/orders/', {
          params: {
            query: {
              organization_id: organization.id,
              limit: 10,
              sorting: ['-created_at'],
            },
          },
        }),
      ),
    enabled: organization.permissions.includes('sales:read'),
  })

  const account = useQuery({
    queryKey: ['dashboard-widget-account', organization.id],
    queryFn: () =>
      unwrap(
        api.GET('/v1/organizations/{id}/account', {
          params: { path: { id: organization.id } },
        }),
      ),
    enabled: organization.permissions.includes('finance:read'),
    retry: false,
  })

  const summary = useQuery({
    queryKey: ['dashboard-widget-transactions-summary', account.data?.id],
    queryFn: () =>
      unwrap(
        api.GET('/v1/transactions/summary', {
          params: { query: { account_id: account.data?.id ?? '' } },
        }),
      ),
    enabled: !!account.data?.id,
  })

  const payouts = useQuery({
    queryKey: ['dashboard-widget-payouts', account.data?.id],
    queryFn: () =>
      unwrap(
        api.GET('/v1/payouts/', {
          params: {
            query: {
              account_id: account.data?.id,
              limit: 10,
              sorting: ['-created_at'],
            },
          },
        }),
      ),
    enabled: !!account.data?.id,
  })

  return { account, orders, payouts, revenue, summary }
}

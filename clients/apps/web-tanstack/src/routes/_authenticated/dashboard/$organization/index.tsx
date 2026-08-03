import { DashboardOverview } from '@/components/DashboardOverview/DashboardOverview'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/$organization/',
)({
  head: () => ({ meta: [{ title: 'Overview | Polar' }] }),
  component: DashboardHomePage,
})

function DashboardHomePage() {
  const { organization } = Route.useRouteContext()
  return <DashboardOverview organization={organization} />
}

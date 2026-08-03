import { DashboardLayout } from '@/components/Layout/Dashboard/DashboardLayout'
import {
  Outlet,
  createFileRoute,
  notFound,
  redirect,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/$organization')(
  {
    beforeLoad: ({ context, params }) => {
      const organization = context.user.organizations?.find(
        ({ slug }) => slug === params.organization,
      )
      if (organization) {
        return { organization }
      }

      const membership = context.user.member_organizations?.find(
        ({ slug }) => slug === params.organization,
      )
      if (membership?.requires_sso) {
        throw redirect({
          to: '/auth/sso/$slug',
          params: { slug: params.organization },
          search: { return_to: `/dashboard/${params.organization}` },
        })
      }
      if (!membership) {
        throw notFound()
      }
      throw redirect({ to: '/dashboard', search: {} })
    },
    component: DashboardOrganizationLayout,
  },
)

function DashboardOrganizationLayout() {
  const { organization, user } = Route.useRouteContext()

  return (
    <DashboardLayout
      organization={organization}
      organizations={user.organizations ?? []}
      memberOrganizations={user.member_organizations ?? []}
      user={user}
    >
      <Outlet />
    </DashboardLayout>
  )
}

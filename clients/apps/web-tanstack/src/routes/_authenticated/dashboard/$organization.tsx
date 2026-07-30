import { Box } from '@polar-sh/orbit/Box'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

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
    head: () => ({ meta: [{ title: 'Overview | Polar' }] }),
    component: DashboardHomePage,
  },
)

function DashboardHomePage() {
  return (
    <Box
      as="main"
      minHeight="100vh"
      width="100%"
      backgroundColor="background-primary"
    >
      Dash
    </Box>
  )
}

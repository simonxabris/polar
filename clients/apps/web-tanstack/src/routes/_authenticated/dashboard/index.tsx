import { getLastVisitedOrganizationSlug } from '@/utils/auth.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  beforeLoad: async ({ context, location }) => {
    const organizations = context.user.organizations ?? []
    if (organizations.length === 0) {
      throw redirect({ href: `/onboarding/start${location.searchStr}` })
    }

    const lastVisitedSlug = await getLastVisitedOrganizationSlug()
    const organization =
      organizations.find(({ slug }) => slug === lastVisitedSlug) ??
      organizations[0]

    throw redirect({
      to: '/dashboard/$organization',
      params: { organization: organization.slug },
      search: (previous) => previous,
    })
  },
})

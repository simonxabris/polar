import type { schemas } from '@polar-sh/client'
import { useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'
import { DashboardNavList } from './DashboardNavList'
import {
  getLegacyNavigationRoutes,
  getProductNavigationRoutes,
} from './DashboardNavigationItems'

export const DashboardNavigation = ({
  organization,
}: {
  organization: schemas['OrganizationWithRole']
}) => {
  const pathname = useLocation({ select: (location) => location.pathname })
  const productNavigation = useMemo(
    () => getProductNavigationRoutes(organization),
    [organization],
  )
  const legacyNavigation = useMemo(
    () => getLegacyNavigationRoutes(organization),
    [organization],
  )

  if (!organization.feature_settings?.compass_enabled) {
    return (
      <DashboardNavList
        routes={legacyNavigation}
        pathname={pathname}
        organizationSlug={organization.slug}
      />
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <DashboardNavList
        routes={productNavigation.insights}
        pathname={pathname}
        organizationSlug={organization.slug}
      />
      <div className="flex w-full flex-col gap-2">
        <span className="dark:text-polar-500 px-2 text-xs font-medium text-gray-400">
          Billing
        </span>
        <DashboardNavList
          routes={productNavigation.billing}
          pathname={pathname}
          organizationSlug={organization.slug}
        />
      </div>
    </div>
  )
}

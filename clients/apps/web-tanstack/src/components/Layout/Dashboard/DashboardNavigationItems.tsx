import { AppealCaseUnreadBadge } from '@/components/Organization/AppealCaseUnreadBadge'
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined'
import BoltOutlined from '@mui/icons-material/BoltOutlined'
import ExploreOutlined from '@mui/icons-material/ExploreOutlined'
import GavelOutlined from '@mui/icons-material/GavelOutlined'
import HiveOutlined from '@mui/icons-material/HiveOutlined'
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined'
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined'
import SignalCellularAltOutlined from '@mui/icons-material/SignalCellularAltOutlined'
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined'
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined'
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import type { schemas } from '@polar-sh/client'
import { ShoppingCart } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'

export interface DashboardSubRoute {
  title: string
  link: string
  icon?: ReactNode
  extra?: ReactNode
  enabled?: boolean
  isActive?: boolean
}

export interface DashboardRoute {
  id: string
  title: string
  icon: ReactElement
  link: string
  enabled?: boolean
  exact?: boolean
  subs?: DashboardSubRoute[]
  extra?: ReactNode
  isActive?: boolean
}

const productRoute = (slug: string, metersFirst: boolean): DashboardRoute => {
  const catalogue = { title: 'Catalogue', link: `/dashboard/${slug}/products` }
  const meters = {
    title: 'Meters',
    link: `/dashboard/${slug}/products/meters`,
  }
  const remaining = [
    {
      title: 'Checkout Links',
      link: `/dashboard/${slug}/products/checkout-links`,
    },
    {
      title: 'Discounts',
      link: `/dashboard/${slug}/products/discounts`,
    },
    {
      title: 'Benefits',
      link: `/dashboard/${slug}/products/benefits`,
    },
  ]

  return {
    id: 'products',
    title: 'Products',
    icon: <HiveOutlined fontSize="inherit" />,
    link: catalogue.link,
    subs: metersFirst
      ? [catalogue, meters, ...remaining]
      : [catalogue, ...remaining, meters],
  }
}

const salesRoute = (
  organization: schemas['OrganizationWithRole'],
): DashboardRoute => ({
  id: 'sales',
  title: 'Sales',
  icon: <ShoppingBagOutlined fontSize="inherit" />,
  link: `/dashboard/${organization.slug}/sales`,
  subs: [
    { title: 'Orders', link: `/dashboard/${organization.slug}/sales` },
    {
      title: 'Subscriptions',
      link: `/dashboard/${organization.slug}/sales/subscriptions`,
    },
    {
      title: 'Checkouts',
      link: `/dashboard/${organization.slug}/sales/checkouts`,
      icon: <ShoppingCart />,
    },
    {
      title: 'Disputes',
      link: `/dashboard/${organization.slug}/sales/disputes`,
      icon: <GavelOutlined fontSize="inherit" />,
      enabled: organization.feature_settings?.disputes_enabled,
    },
  ],
})

const financeRoute = (
  organization: schemas['OrganizationWithRole'],
): DashboardRoute => ({
  id: 'finance',
  title: 'Finance',
  icon: <AttachMoneyOutlined fontSize="inherit" />,
  link: `/dashboard/${organization.slug}/finance`,
  extra: <AppealCaseUnreadBadge organization={organization} />,
  subs: [
    { title: 'Income', link: `/dashboard/${organization.slug}/finance/income` },
    {
      title: 'Payouts',
      link: `/dashboard/${organization.slug}/finance/payouts`,
    },
    { title: 'Taxes', link: `/dashboard/${organization.slug}/finance/taxes` },
    {
      title: 'Account',
      link: `/dashboard/${organization.slug}/finance/account`,
      extra: <AppealCaseUnreadBadge organization={organization} />,
    },
  ],
})

const settingsRoute = (
  organization: schemas['OrganizationWithRole'],
): DashboardRoute => ({
  id: 'settings',
  title: 'Settings',
  icon: <TuneOutlined fontSize="inherit" />,
  link: `/dashboard/${organization.slug}/settings`,
  subs: [
    { title: 'Preferences', link: `/dashboard/${organization.slug}/settings` },
    {
      title: 'Billing',
      link: `/dashboard/${organization.slug}/settings/billing`,
      enabled: organization.permissions.includes('organization:manage'),
    },
    {
      title: 'Members',
      link: `/dashboard/${organization.slug}/settings/members`,
    },
    {
      title: 'Webhooks',
      link: `/dashboard/${organization.slug}/settings/webhooks`,
    },
    {
      title: 'Custom Fields',
      link: `/dashboard/${organization.slug}/settings/custom-fields`,
    },
    {
      title: 'Single Sign-On',
      link: `/dashboard/${organization.slug}/settings/sso`,
      enabled: organization.feature_settings?.sso_enabled,
    },
    {
      title: 'Migrations',
      link: `/dashboard/${organization.slug}/settings/migrations`,
      enabled: organization.feature_settings?.merchant_migration_enabled,
    },
  ],
})

const homeRoute = (slug: string): DashboardRoute => ({
  id: 'home',
  title: 'Home',
  icon: <SpaceDashboardOutlined fontSize="inherit" />,
  link: `/dashboard/${slug}`,
  exact: true,
})

export const getProductNavigationRoutes = (
  organization: schemas['OrganizationWithRole'],
) => {
  const { slug } = organization
  const insights: DashboardRoute[] = [
    homeRoute(slug),
    {
      id: 'compass',
      title: 'Compass',
      icon: <ExploreOutlined fontSize="inherit" />,
      link: `/dashboard/${slug}/compass`,
    },
    {
      id: 'metrics',
      title: 'Metrics',
      icon: <SignalCellularAltOutlined fontSize="inherit" />,
      link: `/dashboard/${slug}/analytics/metrics`,
    },
    {
      id: 'costs',
      title: 'Costs',
      icon: <TrendingDownOutlined fontSize="inherit" />,
      link: `/dashboard/${slug}/analytics/costs`,
    },
    {
      id: 'events',
      title: 'Events',
      icon: <BoltOutlined fontSize="inherit" />,
      link: `/dashboard/${slug}/analytics/events`,
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: <PeopleAltOutlined fontSize="inherit" />,
      link: `/dashboard/${slug}/customers`,
    },
  ]
  const billing = [
    productRoute(slug, true),
    salesRoute(organization),
    financeRoute(organization),
    settingsRoute(organization),
  ]
  return { insights, billing }
}

export const getLegacyNavigationRoutes = (
  organization: schemas['OrganizationWithRole'],
): DashboardRoute[] => {
  const { slug } = organization
  return [
    homeRoute(slug),
    productRoute(slug, false),
    {
      id: 'customers',
      title: 'Customers',
      icon: <PeopleAltOutlined fontSize="inherit" />,
      link: `/dashboard/${slug}/customers`,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <TrendingUpOutlined fontSize="inherit" />,
      link: `/dashboard/${slug}/analytics`,
      subs: [
        { title: 'Metrics', link: `/dashboard/${slug}/analytics/metrics` },
        { title: 'Events', link: `/dashboard/${slug}/analytics/events` },
        { title: 'Costs', link: `/dashboard/${slug}/analytics/costs` },
      ],
    },
    salesRoute(organization),
    financeRoute(organization),
    settingsRoute(organization),
  ]
}

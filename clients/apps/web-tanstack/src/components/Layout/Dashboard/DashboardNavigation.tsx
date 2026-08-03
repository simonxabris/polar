import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined'
import BoltOutlined from '@mui/icons-material/BoltOutlined'
import ExploreOutlined from '@mui/icons-material/ExploreOutlined'
import HiveOutlined from '@mui/icons-material/HiveOutlined'
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined'
import SignalCellularAltOutlined from '@mui/icons-material/SignalCellularAltOutlined'
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined'
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined'
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined'
import type { schemas } from '@polar-sh/client'
import { Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@polar-sh/ui/components/atoms/Sidebar'
import type { ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

interface NavigationItem {
  icon: ReactElement
  id: string
  title: string
}

const insightsItems = (
  organization: schemas['OrganizationWithRole'],
): NavigationItem[] => [
  {
    id: 'home',
    title: 'Home',
    icon: <SpaceDashboardOutlined fontSize="inherit" />,
  },
  ...(organization.feature_settings?.compass_enabled
    ? [
        {
          id: 'compass',
          title: 'Compass',
          icon: <ExploreOutlined fontSize="inherit" />,
        },
      ]
    : []),
  {
    id: 'metrics',
    title: 'Metrics',
    icon: <SignalCellularAltOutlined fontSize="inherit" />,
  },
  {
    id: 'costs',
    title: 'Costs',
    icon: <TrendingDownOutlined fontSize="inherit" />,
  },
  {
    id: 'events',
    title: 'Events',
    icon: <BoltOutlined fontSize="inherit" />,
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: <PeopleAltOutlined fontSize="inherit" />,
  },
]

const billingItems: NavigationItem[] = [
  {
    id: 'products',
    title: 'Products',
    icon: <HiveOutlined fontSize="inherit" />,
  },
  {
    id: 'sales',
    title: 'Sales',
    icon: <ShoppingBagOutlined fontSize="inherit" />,
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: <AttachMoneyOutlined fontSize="inherit" />,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <SettingsOutlined fontSize="inherit" />,
  },
]

const NavigationList = ({ items }: { items: NavigationItem[] }) => (
  <SidebarMenu>
    {items.map((item) => {
      const isActive = item.id === 'home'
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            type="button"
            tooltip={item.title}
            isActive={isActive}
            className={twMerge(
              'flex flex-row items-center rounded-lg border border-transparent px-2 transition-colors dark:border-transparent',
              isActive
                ? 'dark:!bg-polar-900 dark:border-polar-800 border-gray-200 bg-white! text-black shadow-xs dark:text-white'
                : 'dark:text-polar-500 dark:hover:text-polar-200 text-gray-500 hover:text-black',
            )}
          >
            <span
              className={
                isActive
                  ? 'flex flex-col items-center justify-center overflow-visible rounded-full bg-transparent text-[15px] text-black dark:text-white'
                  : 'flex flex-col items-center justify-center overflow-visible rounded-full bg-transparent text-[15px]'
              }
            >
              {item.icon}
            </span>
            <span className="relative ml-2 overflow-visible! text-sm font-medium">
              {item.title}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })}
  </SidebarMenu>
)

const legacyItems: NavigationItem[] = [
  {
    id: 'home',
    title: 'Home',
    icon: <SpaceDashboardOutlined fontSize="inherit" />,
  },
  {
    id: 'products',
    title: 'Products',
    icon: <HiveOutlined fontSize="inherit" />,
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: <PeopleAltOutlined fontSize="inherit" />,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <TrendingUpOutlined fontSize="inherit" />,
  },
  {
    id: 'sales',
    title: 'Sales',
    icon: <ShoppingBagOutlined fontSize="inherit" />,
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: <AttachMoneyOutlined fontSize="inherit" />,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <SettingsOutlined fontSize="inherit" />,
  },
]

export const DashboardNavigation = ({
  organization,
}: {
  organization: schemas['OrganizationWithRole']
}) => {
  if (!organization.feature_settings?.compass_enabled) {
    return <NavigationList items={legacyItems} />
  }

  return (
    <Box width="100%" flexDirection="column" rowGap="xl">
      <NavigationList items={insightsItems(organization)} />
      <Box width="100%" flexDirection="column" rowGap="s">
        <Box paddingHorizontal="s">
          <Text variant="caption" color="muted">
            Billing
          </Text>
        </Box>
        <NavigationList items={billingItems} />
      </Box>
    </Box>
  )
}

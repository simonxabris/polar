import { PolarLogotype } from '@/components/Layout/Public/PolarLogotype'
import Link from '@/components/Link'
import { api } from '@/utils/client'
import { CONFIG } from '@/utils/config'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import BoltOutlined from '@mui/icons-material/BoltOutlined'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import LockOutlined from '@mui/icons-material/LockOutlined'
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import { unwrap, type schemas } from '@polar-sh/client'
import { Avatar, Button, Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@polar-sh/ui/components/atoms/Sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@polar-sh/ui/components/ui/dropdown-menu'
import { Separator } from '@polar-sh/ui/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { DashboardNavigation } from './DashboardNavigation'

interface DashboardSidebarProps {
  memberOrganizations: schemas['MemberOrganization'][]
  organization: schemas['OrganizationWithRole']
  organizations: schemas['OrganizationWithRole'][]
}

export const DashboardSidebar = ({
  memberOrganizations,
  organization,
  organizations,
}: DashboardSidebarProps) => {
  const navigate = useNavigate()
  const subscriptionPlan = useQuery({
    queryKey: ['organization-billing', organization.id, 'subscription'],
    queryFn: () =>
      unwrap(
        api.GET('/v1/organizations/{id}/subscription', {
          params: { path: { id: organization.id } },
        }),
      ),
    retry: false,
  })
  const isOnFreePlan = subscriptionPlan.data?.subscription_id === null
  const accessibleOrganizationIds = new Set(organizations.map(({ id }) => id))
  const ssoOrganizations = memberOrganizations.filter(
    ({ id, requires_sso }) =>
      requires_sso && !accessibleOrganizationIds.has(id),
  )

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-between pt-3.5">
        <PolarLogotype size={32} href={`/dashboard/${organization.slug}`} />
        <Box alignItems="center" columnGap="xs">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Notifications"
            className="size-8! p-0"
          >
            <BoltOutlined fontSize="small" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Search"
            className="size-8! p-0"
          >
            <SearchOutlined fontSize="small" />
          </Button>
        </Box>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 py-2">
        <DashboardNavigation organization={organization} />
      </SidebarContent>

      <SidebarFooter>
        {isOnFreePlan && (
          <div className="dark:bg-polar-900 dark:border-polar-700 flex flex-col gap-y-2 rounded-sm border border-gray-100 bg-white p-4">
            <h3 className="text-sm text-gray-900 dark:text-white">
              Introducing Polar Plans
            </h3>
            <p className="dark:text-polar-500 text-sm text-gray-500">
              Get a lower fee with our subscription plans
            </p>
            <span className="text-sm text-indigo-500">Upgrade</span>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" tooltip="Support">
              <SupportAgentOutlined fontSize="small" />
              <Text as="span" variant="default" color="inherit">
                Support
              </Text>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Link
          href="https://polar.sh/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-polar-500 flex items-center rounded-lg px-2 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-black dark:hover:text-white"
        >
          <ArrowOutwardOutlined fontSize="inherit" />
          <Box as="span" marginLeft="l">
            Documentation
          </Box>
        </Link>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar
                    name={organization.name}
                    avatar_url={organization.avatar_url}
                    className="h-6 w-6"
                  />
                  <Text as="span" variant="default" truncate>
                    {organization.name}
                  </Text>
                  <KeyboardArrowDown className="ml-auto" fontSize="small" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="center"
                className="w-(--radix-popper-anchor-width) min-w-[220px]"
              >
                {organizations.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    className="flex-row gap-x-2"
                    onClick={() =>
                      void navigate({
                        to: '/dashboard/$organization',
                        params: { organization: item.slug },
                      })
                    }
                  >
                    <Avatar
                      name={item.name}
                      avatar_url={item.avatar_url}
                      className="h-6 w-6"
                    />
                    <Text as="span" variant="default" truncate>
                      {item.name}
                    </Text>
                  </DropdownMenuItem>
                ))}
                {ssoOrganizations.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    className="flex-row gap-x-2"
                    onClick={() =>
                      void navigate({
                        to: '/auth/sso/$slug',
                        params: { slug: item.slug },
                        search: {},
                      })
                    }
                  >
                    <Avatar
                      name={item.name}
                      avatar_url={item.avatar_url}
                      className="h-6 w-6"
                    />
                    <Text as="span" variant="default" truncate>
                      {item.name}
                    </Text>
                    <LockOutlined className="ml-auto" fontSize="small" />
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>New Organization</DropdownMenuItem>
                <DropdownMenuItem disabled>User Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    window.location.assign(`${CONFIG.BASE_URL}/v1/auth/logout`)
                  }
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

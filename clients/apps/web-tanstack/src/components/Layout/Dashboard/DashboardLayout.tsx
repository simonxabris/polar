import LogoIcon from '@/components/Brand/logos/LogoIcon'
import { CONFIG } from '@/utils/config'
import type { schemas } from '@polar-sh/client'
import { Avatar } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import {
  SidebarProvider,
  SidebarTrigger,
} from '@polar-sh/ui/components/atoms/Sidebar'
import { useEffect, type PropsWithChildren } from 'react'
import { DashboardSidebar } from './DashboardSidebar'

interface DashboardLayoutProps extends PropsWithChildren {
  memberOrganizations: schemas['MemberOrganization'][]
  organization: schemas['OrganizationWithRole']
  organizations: schemas['OrganizationWithRole'][]
  user: schemas['UserRead']
}

const COOKIE_MAX_AGE = 30 * 86400

export const DashboardLayout = ({
  children,
  memberOrganizations,
  organization,
  organizations,
  user,
}: DashboardLayoutProps) => {
  useEffect(() => {
    document.cookie = `last_visited_org=${encodeURIComponent(organization.slug)}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`
    document.cookie = `polar_env=${CONFIG.IS_SANDBOX ? 'sandbox' : 'production'}; max-age=1800; path=/; samesite=lax`
  }, [organization.slug])

  return (
    <SidebarProvider open>
      <Box
        minHeight="100vh"
        height={{ base: 'auto', md: '100vh' }}
        width="100%"
        flexDirection={{ base: 'column', md: 'row' }}
        padding={{ base: 'none', md: 's' }}
        backgroundColor="background-primary"
      >
        <MobileDashboardHeader user={user} />
        <Box
          display={{ base: 'none', md: 'flex' }}
          height="100%"
          flexShrink={0}
        >
          <DashboardSidebar
            organization={organization}
            organizations={organizations}
            memberOrganizations={memberOrganizations}
          />
        </Box>
        <Box
          minWidth={0}
          minHeight={0}
          height={{ base: 'auto', md: '100%' }}
          flex={1}
        >
          <Box
            as="main"
            minHeight={{ base: 'calc(100vh - 72px)', md: '100%' }}
            height={{ base: 'auto', md: '100%' }}
            width="100%"
            overflowY={{ base: 'visible', md: 'auto' }}
            borderWidth={{ base: 0, md: 1 }}
            borderStyle="solid"
            borderColor="border-primary"
            borderRadius="l"
            boxShadow={{ base: 'none', md: 's' }}
            backgroundColor="background-secondary"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </SidebarProvider>
  )
}

const MobileDashboardHeader = ({ user }: { user: schemas['UserRead'] }) => (
  <Box
    as="header"
    display={{ base: 'flex', md: 'none' }}
    position="sticky"
    top={0}
    zIndex={20}
    width="100%"
    height={72}
    flexDirection="row"
    alignItems="center"
    justifyContent="between"
    paddingHorizontal="l"
    backgroundColor="background-secondary"
  >
    <LogoIcon size={40} className="text-black dark:text-white" />
    <Box alignItems="center" columnGap="xl">
      <div className="dark:border-polar-800 relative flex shrink-0 flex-row items-center rounded-full border-2 border-gray-50 shadow-xs">
        <Avatar
          className="h-8 w-8"
          name={user.email}
          avatar_url={user.avatar_url}
        />
      </div>
      <SidebarTrigger />
    </Box>
  </Box>
)

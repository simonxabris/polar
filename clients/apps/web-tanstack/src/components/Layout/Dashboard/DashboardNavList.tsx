import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from '@polar-sh/ui/components/atoms/Sidebar'
import { useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import type {
  DashboardRoute,
  DashboardSubRoute,
} from './DashboardNavigationItems'

const resolveSubRoute = (
  pathname: string,
  parent: DashboardRoute,
  subRoute: DashboardSubRoute,
) => {
  let isActive = subRoute.link === pathname
  if (!isActive && pathname.startsWith(subRoute.link)) {
    if (parent.link !== subRoute.link) {
      isActive = true
    } else {
      const hasMoreSpecificMatch = parent.subs?.some(
        (candidate) =>
          candidate !== subRoute &&
          candidate.link !== subRoute.link &&
          pathname.startsWith(candidate.link),
      )
      isActive = !hasMoreSpecificMatch
    }
  }
  return { ...subRoute, isActive }
}

const resolveRoute = (pathname: string, route: DashboardRoute) => {
  const subs = route.subs?.filter(({ enabled }) => enabled !== false)
  const filteredRoute = { ...route, subs }
  return {
    ...filteredRoute,
    isActive: route.exact
      ? pathname === route.link
      : pathname.startsWith(route.link),
    subs: subs?.map((subRoute) =>
      resolveSubRoute(pathname, filteredRoute, subRoute),
    ),
  }
}

const DashboardNavLink = ({
  children,
  className,
  link,
  onClick,
  organizationSlug,
}: {
  children: ReactNode
  className: string
  link: string
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void
  organizationSlug: string
}) => {
  if (link === `/dashboard/${organizationSlug}`) {
    return (
      <Link
        to="/dashboard/$organization"
        params={{ organization: organizationSlug }}
        search={{}}
        className={className}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }
  if (link === `/dashboard/${organizationSlug}/products`) {
    return (
      <Link
        to="/dashboard/$organization/products"
        params={{ organization: organizationSlug }}
        search={{}}
        className={className}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }
  return (
    <a href={link} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

export const DashboardNavList = ({
  organizationSlug,
  pathname,
  routes,
}: {
  organizationSlug: string
  pathname: string
  routes: DashboardRoute[]
}) => {
  const resolvedRoutes = useMemo(
    () => routes.map((route) => resolveRoute(pathname, route)),
    [pathname, routes],
  )
  const { isMobile, setOpenMobile } = useSidebar()
  const [expandedRoute, setExpandedRoute] = useState<string | null>(
    () =>
      resolvedRoutes.find((route) => route.isActive && route.subs)?.link ??
      null,
  )

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarMenu>
      {resolvedRoutes.map((route) => (
        <SidebarMenuItem key={route.link}>
          <SidebarMenuButton
            tooltip={route.title}
            asChild
            isActive={route.isActive}
          >
            <DashboardNavLink
              organizationSlug={organizationSlug}
              link={route.link}
              className={twMerge(
                'flex flex-row items-center rounded-lg border border-transparent px-2 transition-colors dark:border-transparent',
                route.isActive
                  ? 'dark:!bg-polar-900 dark:border-polar-800 border-gray-200 bg-white! text-black shadow-xs dark:text-white'
                  : 'dark:text-polar-500 dark:hover:text-polar-200 text-gray-500 hover:text-black',
              )}
              onClick={(event) => {
                if (!isMobile) return
                if (route.subs?.length) {
                  event.preventDefault()
                  setExpandedRoute((previous) =>
                    previous === route.link ? null : route.link,
                  )
                } else {
                  setOpenMobile(false)
                }
              }}
            >
              <span
                className={twMerge(
                  'flex flex-col items-center justify-center overflow-visible rounded-full bg-transparent text-[15px]',
                  route.isActive
                    ? 'text-black dark:text-white'
                    : 'bg-transparent',
                )}
              >
                {route.icon}
              </span>
              <span className="relative ml-2 overflow-visible! text-sm font-medium">
                {route.title}
                {route.extra ? (
                  <span className="absolute -top-0.5 -right-2 flex">
                    {route.extra}
                  </span>
                ) : null}
              </span>
            </DashboardNavLink>
          </SidebarMenuButton>
          {(isMobile ? expandedRoute === route.link : route.isActive) &&
          route.subs ? (
            <SidebarMenuSub className="my-2 gap-y-2">
              {route.subs.map((subRoute) => (
                <SidebarMenuSubItem key={subRoute.link}>
                  <DashboardNavLink
                    organizationSlug={organizationSlug}
                    link={subRoute.link}
                    className={twMerge(
                      'dark:text-polar-500 ml-4 inline-flex flex-row items-center gap-x-2 text-sm font-medium text-gray-500 transition-colors hover:text-black dark:hover:text-white',
                      subRoute.isActive && 'text-black dark:text-white',
                    )}
                    onClick={() => closeOnMobile()}
                  >
                    <span className="relative">
                      {subRoute.title}
                      {subRoute.extra ? (
                        <span className="absolute -top-0.5 -right-2 flex">
                          {subRoute.extra}
                        </span>
                      ) : null}
                    </span>
                  </DashboardNavLink>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          ) : null}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

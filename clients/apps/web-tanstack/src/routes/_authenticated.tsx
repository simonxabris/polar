import { getCurrentUser } from '@/utils/auth.functions'
import { sanitizeReturnTo } from '@/utils/auth'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({
        to: '/auth',
        search: { return_to: sanitizeReturnTo(location.href) },
      })
    }
    return { user }
  },
  component: Outlet,
})

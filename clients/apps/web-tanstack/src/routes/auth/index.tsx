import Auth from '@/components/Auth/Auth'
import AuthHeader from '@/components/Auth/AuthHeader'
import { AuthPageShell } from '@/components/Auth/AuthPageShell'
import { getAuthPageState } from '@/utils/auth.functions'
import {
  getAuthenticationSessionCompleteURL,
  getAuthenticationSessionRedirectPath,
  sanitizeReturnTo,
} from '@/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const authSearchSchema = z.object({
  error: z.string().optional(),
  return_to: z.string().optional(),
  from: z.string().optional(),
})

export const Route = createFileRoute('/auth/')({
  validateSearch: authSearchSchema,
  beforeLoad: async ({ search }) => {
    const state = await getAuthPageState()
    const returnTo = sanitizeReturnTo(search.return_to)

    if (state.user) {
      throw redirect({ href: returnTo })
    }
    if (
      state.authenticationSession?.identity_id &&
      state.authenticationSession.available_factors.length === 0
    ) {
      throw redirect({ href: getAuthenticationSessionCompleteURL() })
    }
    const factorRoute = getAuthenticationSessionRedirectPath(
      state.authenticationSession,
    )
    if (factorRoute) {
      throw redirect({ to: factorRoute, search: {} })
    }

    return { ...state, returnTo }
  },
  head: () => ({ meta: [{ title: 'Log in to Polar' }] }),
  component: LoginPage,
})

function LoginPage() {
  const { error } = Route.useSearch()
  const { authenticationSession, lastLoginMethod, returnTo } =
    Route.useRouteContext()

  return (
    <AuthPageShell>
      <AuthHeader error={error} />
      <Auth
        authenticationSession={authenticationSession}
        lastLoginMethod={lastLoginMethod}
        returnTo={returnTo}
      />
    </AuthPageShell>
  )
}

import AuthHeader from '@/components/Auth/AuthHeader'
import { AuthPageShell } from '@/components/Auth/AuthPageShell'
import AuthTermsFooter from '@/components/Auth/AuthTermsFooter'
import OrgAuth from '@/components/Auth/OrgAuth'
import { sanitizeReturnTo } from '@/utils/auth'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const ssoSearchSchema = z.object({
  error: z.string().optional(),
  return_to: z.string().optional(),
})

export const Route = createFileRoute('/auth/sso/$slug')({
  validateSearch: ssoSearchSchema,
  head: () => ({ meta: [{ title: 'Sign in with SSO to Polar' }] }),
  component: SSOPage,
})

function SSOPage() {
  const { slug } = Route.useParams()
  const { error, return_to: requestedReturnTo } = Route.useSearch()
  const returnTo = sanitizeReturnTo(requestedReturnTo ?? `/dashboard/${slug}`)

  return (
    <AuthPageShell>
      <AuthHeader error={error} />
      <OrgAuth slug={slug} returnTo={returnTo} />
      <AuthTermsFooter />
    </AuthPageShell>
  )
}

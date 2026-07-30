import { AuthPageShell } from '@/components/Auth/AuthPageShell'
import { VerificationCodeForm } from '@/components/Auth/VerificationCodeForm'
import LogoIcon from '@/components/Brand/logos/LogoIcon'
import { getAuthPageState } from '@/utils/auth.functions'
import { verifyEmailOTP } from '@/utils/auth-api'
import { Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const emailOTPSearchSchema = z.object({
  email: z.string().default('').catch(''),
  intent: z.enum(['login', 'signup']).default('login').catch('login'),
})

export const Route = createFileRoute('/auth/email-otp')({
  validateSearch: emailOTPSearchSchema,
  beforeLoad: async ({ search }) => {
    const { authenticationSession } = await getAuthPageState()
    if (!authenticationSession || !search.email) {
      throw redirect({ to: '/auth', search: {} })
    }
  },
  head: () => ({ meta: [{ title: 'Enter verification code | Polar' }] }),
  component: EmailOTPPage,
})

function EmailOTPPage() {
  const { email, intent } = Route.useSearch()

  return (
    <AuthPageShell>
      <Box flexDirection="column" alignItems="center" rowGap="l">
        <LogoIcon size={60} />
        {intent === 'signup' ? (
          <Text variant="heading-xs" as="h1" align="center">
            Welcome to Polar!
          </Text>
        ) : null}
        <Text color="muted" align="center">
          {intent === 'signup'
            ? 'To get started, we sent a verification code to '
            : 'We sent a verification code to '}
          {email}. Please enter the 6-character code below.
        </Text>
      </Box>
      <VerificationCodeForm
        intent={intent}
        inputMode="text"
        verify={verifyEmailOTP}
      />
    </AuthPageShell>
  )
}

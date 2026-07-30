import { AuthPageShell } from '@/components/Auth/AuthPageShell'
import AuthHeader from '@/components/Auth/AuthHeader'
import { VerificationCodeForm } from '@/components/Auth/VerificationCodeForm'
import { getAuthPageState } from '@/utils/auth.functions'
import { verifyTOTP } from '@/utils/auth-api'
import { Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/totp')({
  beforeLoad: async () => {
    const { authenticationSession } = await getAuthPageState()
    if (
      !authenticationSession?.available_factors.some(
        (factor) => factor.type === 'totp',
      )
    ) {
      throw redirect({ to: '/auth', search: {} })
    }
  },
  head: () => ({ meta: [{ title: 'Two-factor authentication | Polar' }] }),
  component: TOTPPage,
})

function TOTPPage() {
  return (
    <AuthPageShell>
      <AuthHeader />
      <Box flexDirection="column" alignItems="center" rowGap="xl">
        <Text color="muted" align="center">
          Enter the six-digit code from your authenticator app.
        </Text>
        <VerificationCodeForm inputMode="numeric" verify={verifyTOTP} />
        <Link to="/auth/backup-codes">
          <Text variant="caption" color="muted">
            Use a backup code instead
          </Text>
        </Link>
      </Box>
    </AuthPageShell>
  )
}

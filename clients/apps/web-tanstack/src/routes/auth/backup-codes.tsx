import { AuthPageShell } from '@/components/Auth/AuthPageShell'
import AuthHeader from '@/components/Auth/AuthHeader'
import { BackupCodeForm } from '@/components/Auth/BackupCodeForm'
import { getAuthPageState } from '@/utils/auth.functions'
import { Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/backup-codes')({
  beforeLoad: async () => {
    const { authenticationSession } = await getAuthPageState()
    if (
      !authenticationSession?.available_factors.some(
        (factor) => factor.type === 'backup_codes',
      )
    ) {
      throw redirect({ to: '/auth', search: {} })
    }
  },
  head: () => ({ meta: [{ title: 'Use a backup code | Polar' }] }),
  component: BackupCodesPage,
})

function BackupCodesPage() {
  return (
    <AuthPageShell>
      <AuthHeader />
      <Box flexDirection="column" alignItems="center" rowGap="xl">
        <Text color="muted" align="center">
          Enter one of your single-use backup codes.
        </Text>
        <BackupCodeForm />
      </Box>
    </AuthPageShell>
  )
}

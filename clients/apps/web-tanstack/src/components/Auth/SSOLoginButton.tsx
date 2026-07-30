import { usePostHog } from '@/hooks/posthog'
import { getSSOAuthorizeLoginURL } from '@/utils/auth'
import Key from '@mui/icons-material/Key'
import type { ButtonProps } from '@polar-sh/orbit'
import { Button } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { useState } from 'react'

interface SSOLoginButtonProps {
  organizationSlug: string
  connection: { id: string; name: string | null }
  variant?: ButtonProps['variant']
}

const SSOLoginButton = ({
  organizationSlug,
  connection,
  variant,
}: SSOLoginButtonProps) => {
  const posthog = usePostHog()
  const [loading, setLoading] = useState(false)

  const onClick = () => {
    posthog.capture('global:user:login:submit', { method: 'sso' })
    setLoading(true)
    window.location.assign(
      getSSOAuthorizeLoginURL(organizationSlug, connection.id),
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      wrapperClassNames="space-x-2 p-2.5 px-5"
      fullWidth
      loading={loading}
      disabled={loading}
      onClick={onClick}
    >
      <Key fontSize="small" />
      <Box as="span" width={128} textAlign="left">
        {connection.name ?? 'Sign in with SSO'}
      </Box>
    </Button>
  )
}

export default SSOLoginButton

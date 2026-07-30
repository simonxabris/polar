import { usePostHog, type EventName } from '@/hooks/posthog'
import { startAuthenticationSession } from '@/utils/auth-api'
import { sanitizeReturnTo, type LoginMethod } from '@/utils/auth'
import type { schemas } from '@polar-sh/client'
import { Button, Text, type ButtonProps } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { useState, type ReactNode } from 'react'

interface OAuthLoginButtonProps {
  authenticationSession: schemas['AuthenticationSession'] | null
  authorizeUrl: string
  icon: ReactNode
  label: string
  method: Extract<LoginMethod, 'apple' | 'github' | 'google'>
  returnTo?: string
  signup?: boolean
  variant?: ButtonProps['variant']
}

export const OAuthLoginButton = ({
  authenticationSession,
  authorizeUrl,
  icon,
  label,
  method,
  returnTo,
  signup,
  variant,
}: OAuthLoginButtonProps) => {
  const posthog = usePostHog()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    const eventName: EventName = signup
      ? 'global:user:signup:submit'
      : 'global:user:login:submit'
    posthog.capture(eventName, { method })
    setError(null)
    setLoading(true)

    try {
      if (!authenticationSession) {
        await startAuthenticationSession(sanitizeReturnTo(returnTo))
      }
      window.location.assign(authorizeUrl)
    } catch {
      setError('Could not start authentication. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Box flexDirection="column" rowGap="s">
      <Button
        type="button"
        variant={variant}
        wrapperClassNames="space-x-2 p-2.5 px-5"
        fullWidth
        loading={loading}
        disabled={loading}
        onClick={onClick}
      >
        {icon}
        <Box as="span" width={128} textAlign="left">
          {signup ? `Sign up with ${label}` : `Sign in with ${label}`}
        </Box>
      </Button>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </Box>
  )
}

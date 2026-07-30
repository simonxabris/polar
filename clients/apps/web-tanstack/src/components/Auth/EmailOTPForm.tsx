import { usePostHog, type EventName } from '@/hooks/posthog'
import { getAuthErrorMessage } from '@/utils/auth-errors'
import { requestEmailOTP, startAuthenticationSession } from '@/utils/auth-api'
import { sanitizeReturnTo } from '@/utils/auth'
import type { schemas } from '@polar-sh/client'
import { Button, Input, Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'

interface EmailOTPFormProps {
  authenticationSession: schemas['AuthenticationSession'] | null
  returnTo?: string
  signup?: boolean
}

interface TurnstileAPI {
  remove: (widgetId: string) => void
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      size: 'flexible'
    },
  ) => string
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI
  }
}

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script'
const TURNSTILE_ACTION = 'turnstile-spin-v2'
const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_ENVIRONMENT === 'development' || import.meta.env.DEV
    ? '1x00000000000000000000AA'
    : '0x4AAAAAAD7cBrbpX3kX8K9g'

const EmailOTPForm = ({
  authenticationSession,
  returnTo,
  signup,
}: EmailOTPFormProps) => {
  const navigate = useNavigate()
  const posthog = usePostHog()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)

  const renderTurnstile = useCallback(() => {
    const container = turnstileContainerRef.current
    if (!window.turnstile || !container || turnstileWidgetIdRef.current) {
      return
    }
    turnstileWidgetIdRef.current = window.turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      action: TURNSTILE_ACTION,
      size: 'flexible',
    })
  }, [])

  useEffect(() => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID)
    const script =
      existingScript instanceof HTMLScriptElement
        ? existingScript
        : document.createElement('script')

    script.addEventListener('load', renderTurnstile)
    if (!existingScript) {
      script.id = TURNSTILE_SCRIPT_ID
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      document.head.appendChild(script)
    } else {
      renderTurnstile()
    }

    return () => {
      script.removeEventListener('load', renderTurnstile)
      const widgetId = turnstileWidgetIdRef.current
      if (widgetId) {
        window.turnstile?.remove(widgetId)
      }
      turnstileWidgetIdRef.current = null
    }
  }, [renderTurnstile])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const turnstileToken = new FormData(event.currentTarget).get(
      'cf-turnstile-response',
    )
    if (typeof turnstileToken !== 'string' || !turnstileToken) {
      setError('Please complete the verification challenge.')
      return
    }

    const eventName: EventName = signup
      ? 'global:user:signup:submit'
      : 'global:user:login:submit'
    posthog.capture(eventName, { method: 'email_otp' })
    setError(null)
    setLoading(true)

    try {
      if (!authenticationSession) {
        await startAuthenticationSession(sanitizeReturnTo(returnTo))
      }
      const result = await requestEmailOTP(email, turnstileToken)
      if (result.error) {
        setError(
          getAuthErrorMessage(
            result.error,
            'Could not send a verification code. Please try again.',
          ),
        )
        return
      }
      await navigate({
        to: '/auth/email-otp',
        search: { email, intent: signup ? 'signup' : 'login' },
      })
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      const widgetId = turnstileWidgetIdRef.current
      if (widgetId) {
        window.turnstile?.reset(widgetId)
      }
      setLoading(false)
    }
  }

  return (
    <Box as="form" flexDirection="column" rowGap="s" onSubmit={onSubmit}>
      <Input
        type="email"
        required
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Box ref={turnstileContainerRef} className="cf-turnstile" />
      <Button
        type="submit"
        variant="secondary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {signup ? 'Sign up with email' : 'Sign in with email'}
      </Button>
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </Box>
  )
}

export default EmailOTPForm

import {
  getAuthenticationSession,
  startOrganizationAuthenticationSession,
} from '@/utils/auth-api'
import {
  getAuthenticationSessionRedirectPath,
  getOrgAuthenticationSessionCompleteURL,
} from '@/utils/auth'
import type { schemas } from '@polar-sh/client'
import { Alert, SpinnerNoMargin, Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import AppleLoginButton from './AppleLoginButton'
import EmailOTPForm from './EmailOTPForm'
import GitHubLoginButton from './GitHubLoginButton'
import GoogleLoginButton from './GoogleLoginButton'
import SSOLoginButton from './SSOLoginButton'

type AuthenticationSession = schemas['AuthenticationSession']
type Factor = AuthenticationSession['available_factors'][number]
type SSOFactor = Extract<Factor, { type: 'sso' }>

const isSSOFactor = (factor: Factor): factor is SSOFactor =>
  factor.type === 'sso'

const OrDivider = () => (
  <Box alignItems="center" columnGap="l">
    <Box
      flexGrow={1}
      borderTopWidth={1}
      borderStyle="solid"
      borderColor="border-primary"
    />
    <Text variant="caption" color="muted">
      or
    </Text>
    <Box
      flexGrow={1}
      borderTopWidth={1}
      borderStyle="solid"
      borderColor="border-primary"
    />
  </Box>
)

const OrgAuth = ({ slug, returnTo }: { slug: string; returnTo: string }) => {
  const navigate = useNavigate()
  const initialized = useRef(false)
  const [session, setSession] = useState<AuthenticationSession | null>(null)
  const [status, setStatus] = useState<
    'loading' | 'completing' | 'ready' | 'error'
  >('loading')

  useEffect(() => {
    if (initialized.current) {
      return
    }
    initialized.current = true

    const initialize = async () => {
      try {
        const { data: existing, response } = await getAuthenticationSession()
        if (response.ok && existing?.identity_id) {
          if (existing.available_factors.length === 0) {
            setStatus('completing')
            window.location.assign(getOrgAuthenticationSessionCompleteURL(slug))
            return
          }
          const factorRoute = getAuthenticationSessionRedirectPath(existing)
          if (factorRoute) {
            setStatus('completing')
            await navigate({ to: factorRoute, search: {} })
            return
          }
          setSession(existing)
          setStatus('ready')
          return
        }

        const started = await startOrganizationAuthenticationSession(
          slug,
          returnTo,
        )
        setSession(started)
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    }

    void initialize()
  }, [navigate, returnTo, slug])

  if (status === 'error') {
    return (
      <Alert
        variant="warning"
        title="Could not load single sign-on"
        description="Please try again."
      />
    )
  }

  if (status !== 'ready' || !session) {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
        rowGap="m"
        paddingVertical="2xl"
      >
        <SpinnerNoMargin />
        <Text color="muted">
          {status === 'completing'
            ? 'Signing you in…'
            : 'Loading sign-in options…'}
        </Text>
      </Box>
    )
  }

  const factors = session.available_factors
  const ssoFactors = factors.filter(isSSOFactor)
  const hasApple = factors.some((factor) => factor.type === 'apple')
  const hasGitHub = factors.some((factor) => factor.type === 'github')
  const hasGoogle = factors.some((factor) => factor.type === 'google')
  const hasEmail = factors.some((factor) => factor.type === 'email_otp')
  const hasBaseFactor = hasApple || hasGitHub || hasGoogle || hasEmail

  return (
    <Box flexDirection="column" rowGap="l">
      {ssoFactors.map((factor) => (
        <SSOLoginButton
          key={factor.connection_id}
          organizationSlug={slug}
          connection={{ id: factor.connection_id, name: factor.name }}
          variant="default"
        />
      ))}
      {ssoFactors.length > 0 && hasBaseFactor ? <OrDivider /> : null}
      {hasApple ? (
        <AppleLoginButton
          authenticationSession={session}
          returnTo={returnTo}
          variant="secondary"
        />
      ) : null}
      {hasGitHub ? (
        <GitHubLoginButton
          authenticationSession={session}
          returnTo={returnTo}
          variant="secondary"
        />
      ) : null}
      {hasGoogle ? (
        <GoogleLoginButton
          authenticationSession={session}
          returnTo={returnTo}
          variant="secondary"
        />
      ) : null}
      {hasEmail ? (
        <EmailOTPForm authenticationSession={session} returnTo={returnTo} />
      ) : null}
    </Box>
  )
}

export default OrgAuth

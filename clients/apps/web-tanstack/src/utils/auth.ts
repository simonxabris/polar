import { CONFIG } from '@/utils/config'
import type { schemas } from '@polar-sh/client'

export type LoginMethod =
  | 'email_otp'
  | 'totp'
  | 'backup_codes'
  | 'apple'
  | 'github'
  | 'google'
  | 'sso'

const LOGIN_METHODS: LoginMethod[] = [
  'email_otp',
  'totp',
  'backup_codes',
  'apple',
  'github',
  'google',
  'sso',
]

export const parseLoginMethod = (value: string | undefined) =>
  LOGIN_METHODS.find((method) => method === value) ?? null

export const sanitizeReturnTo = (returnTo: unknown): string => {
  if (
    typeof returnTo !== 'string' ||
    !returnTo.startsWith('/') ||
    returnTo.startsWith('//')
  ) {
    return '/dashboard'
  }
  return returnTo
}

export const getAuthenticationSessionRedirectPath = (
  authenticationSession: schemas['AuthenticationSession'] | null,
): '/auth/totp' | '/auth/backup-codes' | null => {
  if (
    authenticationSession?.available_factors.some(
      (factor) => factor.type === 'totp',
    )
  ) {
    return '/auth/totp'
  }
  if (
    authenticationSession?.available_factors.some(
      (factor) => factor.type === 'backup_codes',
    )
  ) {
    return '/auth/backup-codes'
  }
  return null
}

export const getGitHubAuthorizeLoginURL = (): string =>
  `${CONFIG.BASE_URL}/v1/auth/github/authorize`

export const getGoogleAuthorizeLoginURL = (): string =>
  `${CONFIG.BASE_URL}/v1/auth/google/authorize`

export const getAppleAuthorizeURL = (): string =>
  `${CONFIG.BASE_URL}/v1/auth/apple/authorize`

export const getAuthenticationSessionCompleteURL = (): string =>
  `${CONFIG.BASE_URL}/v1/auth/complete`

export const getSSOAuthorizeLoginURL = (
  organizationSlug: string,
  connectionId: string,
): string =>
  `${CONFIG.BASE_URL}/v1/auth/${organizationSlug}/sso/${connectionId}/authorize`

export const getOrgAuthenticationSessionCompleteURL = (
  organizationSlug: string,
): string => `${CONFIG.BASE_URL}/v1/auth/${organizationSlug}/complete`

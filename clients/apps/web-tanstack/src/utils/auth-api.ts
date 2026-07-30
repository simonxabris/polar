import { unwrap } from '@polar-sh/client'
import { api } from './client'

export const startAuthenticationSession = (returnTo: string) =>
  unwrap(
    api.POST('/v1/auth/start', {
      body: { return_to: returnTo },
    }),
  )

export const startOrganizationAuthenticationSession = (
  slug: string,
  returnTo: string,
) =>
  unwrap(
    api.POST('/v1/auth/{slug}/start', {
      params: { path: { slug } },
      body: { return_to: returnTo },
    }),
  )

export const requestEmailOTP = (email: string, turnstileToken: string) =>
  api.POST('/v1/auth/email-otp/request', {
    body: {
      email,
      'cf-turnstile-response': turnstileToken,
    },
  })

export const verifyEmailOTP = (code: string) =>
  api.POST('/v1/auth/email-otp/verify', { body: { code } })

export const verifyTOTP = (code: string) =>
  api.POST('/v1/auth/totp/verify', { body: { code } })

export const verifyBackupCode = (code: string) =>
  api.POST('/v1/auth/backup-codes/verify', { body: { code } })

export const getAuthenticationSession = () => api.GET('/v1/auth/status')

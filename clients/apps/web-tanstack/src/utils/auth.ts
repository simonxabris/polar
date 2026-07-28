import { CONFIG } from '@/utils/config'

export type LoginMethod =
  | 'email_otp'
  | 'totp'
  | 'backup_codes'
  | 'apple'
  | 'github'
  | 'google'
  | 'sso'

export const getGitHubAuthorizeLoginURL = (): string => {
  return `${CONFIG.BASE_URL}/v1/auth/github/authorize`
}

export const getGoogleAuthorizeLoginURL = (): string => {
  return `${CONFIG.BASE_URL}/v1/auth/google/authorize`
}

export const getAppleAuthorizeURL = (): string => {
  return `${CONFIG.BASE_URL}/v1/auth/apple/authorize`
}

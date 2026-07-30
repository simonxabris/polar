import { createClient } from '@polar-sh/client'
import { getRequest } from '@tanstack/react-start/server'

const PUBLIC_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const getServerSideAPI = () => {
  const request = getRequest()
  const headers: Record<string, string> = {
    'X-Polar-Client-Version': `web-tanstack/${
      import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? 'dev'
    }`,
  }
  const cookie = request.headers.get('cookie')
  const forwardedFor = request.headers.get('x-forwarded-for')

  if (cookie) {
    headers.Cookie = cookie
  }
  if (forwardedFor) {
    headers['X-Forwarded-For'] = forwardedFor
  }
  if (process.env.POLAR_PREVIEW_ACCESS_TOKEN) {
    headers['X-Preview-Token'] = process.env.POLAR_PREVIEW_ACCESS_TOKEN
  }

  return createClient(
    process.env.POLAR_API_URL || process.env.VITE_API_URL || PUBLIC_API_URL,
    undefined,
    headers,
  )
}

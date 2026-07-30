import type { schemas } from '@polar-sh/client'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setResponseHeader } from '@tanstack/react-start/server'
import { parseLoginMethod } from './auth'
import { getServerSideAPI } from './client.server'

const disableSharedCaching = () => {
  setResponseHeader('Cache-Control', 'no-store')
  setResponseHeader('Vary', 'Cookie')
}

const fetchCurrentUser = async (): Promise<schemas['UserRead'] | null> => {
  const { data, response } = await getServerSideAPI().GET('/v1/users/me', {
    cache: 'no-cache',
  })

  if (response.status === 401 || response.status === 429) {
    return null
  }
  if (!response.ok || !data) {
    throw new Error(`Failed to resolve authenticated user: ${response.status}`)
  }
  return data
}

const fetchAuthenticationSession = async (): Promise<
  schemas['AuthenticationSession'] | null
> => {
  const { data, error, response } =
    await getServerSideAPI().GET('/v1/auth/status')

  if (response.status === 429) {
    return null
  }
  if (error) {
    if (error.error === 'InvalidAuthenticationSession') {
      return null
    }
    throw new Error(`Failed to check authentication session: ${error.error}`)
  }
  if (!response.ok || !data) {
    throw new Error(
      `Failed to check authentication session: ${response.status}`,
    )
  }
  return data
}

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    disableSharedCaching()
    return fetchCurrentUser()
  },
)

export const getLastVisitedOrganizationSlug = createServerFn({
  method: 'GET',
}).handler(async () => {
  disableSharedCaching()
  return getCookie('last_visited_org') ?? null
})

export const getAuthPageState = createServerFn({ method: 'GET' }).handler(
  async () => {
    disableSharedCaching()
    const [user, authenticationSession] = await Promise.all([
      fetchCurrentUser(),
      fetchAuthenticationSession(),
    ])

    return {
      user,
      authenticationSession,
      lastLoginMethod: parseLoginMethod(getCookie('polar_last_login_method')),
    }
  },
)

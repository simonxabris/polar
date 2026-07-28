import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

export const getCountryCode = createServerFn({ method: 'GET' }).handler(
  () => getRequestHeader('x-vercel-ip-country') ?? null,
)

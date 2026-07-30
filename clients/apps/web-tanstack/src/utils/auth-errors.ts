export const getAuthErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!error || typeof error !== 'object') {
    return fallback
  }
  if ('detail' in error && typeof error.detail === 'string') {
    return error.detail
  }
  return fallback
}

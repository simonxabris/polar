import { getAuthErrorMessage } from '@/utils/auth-errors'
import { verifyBackupCode } from '@/utils/auth-api'
import { CONFIG } from '@/utils/config'
import { Button, Input, Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const BackupCodeForm = () => {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await verifyBackupCode(code)
      if (result.error) {
        setError(
          getAuthErrorMessage(result.error, 'The backup code is invalid.'),
        )
        return
      }
      await navigate({ to: '/auth', search: {} })
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      as="form"
      width="100%"
      flexDirection="column"
      alignItems="center"
      rowGap="xl"
      onSubmit={onSubmit}
    >
      <Input
        type="text"
        placeholder="Backup code"
        autoComplete="one-time-code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        autoFocus
      />
      {error ? (
        <Text variant="caption" color="danger" align="center">
          {error}
        </Text>
      ) : null}
      <Button type="submit" size="lg" fullWidth loading={loading}>
        Sign in{CONFIG.IS_SANDBOX ? ' to Sandbox' : ''}
      </Button>
    </Box>
  )
}

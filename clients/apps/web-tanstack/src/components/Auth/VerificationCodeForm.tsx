import { getAuthErrorMessage } from '@/utils/auth-errors'
import { CONFIG } from '@/utils/config'
import { Button, Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@polar-sh/ui/components/atoms/InputOTP'
import { useNavigate } from '@tanstack/react-router'
import { useRef, useState, type FormEvent } from 'react'

interface VerificationCodeFormProps {
  intent?: 'login' | 'signup'
  inputMode: 'numeric' | 'text'
  verify: (code: string) => Promise<{ error?: unknown }>
}

export const VerificationCodeForm = ({
  intent = 'login',
  inputMode,
  verify,
}: VerificationCodeFormProps) => {
  const navigate = useNavigate()
  const submittingRef = useRef(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submitCode = async (value: string) => {
    if (submittingRef.current || value.length !== 6) {
      return
    }
    submittingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const result = await verify(value)
      if (result.error) {
        setError(
          getAuthErrorMessage(
            result.error,
            'The verification code is invalid or expired.',
          ),
        )
        return
      }
      await navigate({ to: '/auth', search: {} })
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      submittingRef.current = false
      setLoading(false)
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitCode(code)
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
      <InputOTP
        maxLength={6}
        minLength={6}
        inputMode={inputMode}
        pattern={inputMode === 'text' ? '^[a-zA-Z0-9]+$' : undefined}
        autoComplete="one-time-code"
        value={code}
        autoFocus
        onChange={(value) =>
          setCode(inputMode === 'text' ? value.toUpperCase() : value)
        }
        onComplete={(value) => void submitCode(value)}
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="dark:border-polar-600 h-12 w-12 border-gray-300 text-xl md:h-16 md:w-16 md:text-2xl"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error ? (
        <Text variant="caption" color="danger" align="center">
          {error}
        </Text>
      ) : null}
      <Button type="submit" size="lg" fullWidth loading={loading}>
        {intent === 'signup' ? 'Sign up' : 'Sign in'}
        {CONFIG.IS_SANDBOX ? ' to Sandbox' : ''}
      </Button>
    </Box>
  )
}

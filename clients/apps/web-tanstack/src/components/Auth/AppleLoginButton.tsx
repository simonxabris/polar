import { usePostHog, type EventName } from '@/hooks/posthog'
import Apple from '@mui/icons-material/Apple'
import { Button, type ButtonProps } from '@polar-sh/orbit'
import { getAppleAuthorizeURL } from '@/utils/auth'

interface AppleLoginButtonProps {
  authenticationSession: unknown | null
  returnTo?: string
  signup?: boolean
  variant?: ButtonProps['variant']
}

const AppleLoginButton = ({
  authenticationSession: _authenticationSession,
  signup,
  variant,
}: AppleLoginButtonProps) => {
  const posthog = usePostHog()

  const onClick = async () => {
    let eventName: EventName = 'global:user:login:submit'
    if (signup) {
      eventName = 'global:user:signup:submit'
    }
    posthog.capture(eventName, {
      method: 'apple',
    })

    // NOTE: the auth session-start handshake is not wired up yet in this
    // app, so the OAuth round trip will not complete a login.
    window.location.href = getAppleAuthorizeURL()
  }

  return (
    <a onClick={onClick}>
      <Button
        variant={variant}
        wrapperClassNames="space-x-2 p-2.5 px-5"
        fullWidth
      >
        <Apple />
        <div className="w-32 text-left">
          {signup ? 'Sign up with Apple' : 'Sign in with Apple'}
        </div>
      </Button>
    </a>
  )
}

export default AppleLoginButton

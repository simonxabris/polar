import { usePostHog, type EventName } from '@/hooks/posthog'
import Google from '@mui/icons-material/Google'
import { Button, type ButtonProps } from '@polar-sh/orbit'
import { getGoogleAuthorizeLoginURL } from '@/utils/auth'

interface GoogleLoginButtonProps {
  authenticationSession: unknown | null
  returnTo?: string
  signup?: boolean
  variant?: ButtonProps['variant']
}

const GoogleLoginButton = ({
  authenticationSession: _authenticationSession,
  signup,
  variant,
}: GoogleLoginButtonProps) => {
  const posthog = usePostHog()

  const onClick = async () => {
    let eventName: EventName = 'global:user:login:submit'
    if (signup) {
      eventName = 'global:user:signup:submit'
    }
    posthog.capture(eventName, {
      method: 'google',
    })

    // NOTE: the auth session-start handshake is not wired up yet in this
    // app, so the OAuth round trip will not complete a login.
    window.location.href = getGoogleAuthorizeLoginURL()
  }

  return (
    <a onClick={onClick}>
      <Button
        variant={variant}
        wrapperClassNames="space-x-2 p-2.5 px-5"
        fullWidth
      >
        <Google />
        <div className="w-32 text-left">
          {signup ? 'Sign up with Google' : 'Sign in with Google'}
        </div>
      </Button>
    </a>
  )
}

export default GoogleLoginButton

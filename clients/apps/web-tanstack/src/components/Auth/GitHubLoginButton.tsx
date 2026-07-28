import { usePostHog, type EventName } from '@/hooks/posthog'
import GitHub from '@mui/icons-material/GitHub'
import { Button, type ButtonProps } from '@polar-sh/orbit'
import { getGitHubAuthorizeLoginURL } from '@/utils/auth'

interface GitHubLoginButtonProps {
  authenticationSession: unknown | null
  returnTo?: string
  signup?: boolean
  variant?: ButtonProps['variant']
}

const GitHubLoginButton = ({
  authenticationSession: _authenticationSession,
  signup,
  variant,
}: GitHubLoginButtonProps) => {
  const posthog = usePostHog()

  const onClick = async () => {
    let eventName: EventName = 'global:user:login:submit'
    if (signup) {
      eventName = 'global:user:signup:submit'
    }
    posthog.capture(eventName, {
      method: 'github',
    })

    // NOTE: the auth session-start handshake is not wired up yet in this
    // app, so the OAuth round trip will not complete a login.
    window.location.href = getGitHubAuthorizeLoginURL()
  }

  return (
    <a onClick={onClick}>
      <Button
        variant={variant}
        wrapperClassNames="space-x-2 p-2.5 px-5"
        fullWidth
      >
        <GitHub />
        <div className="w-32 text-left">
          {signup ? 'Sign up with GitHub' : 'Sign in with GitHub'}
        </div>
      </Button>
    </a>
  )
}

export default GitHubLoginButton

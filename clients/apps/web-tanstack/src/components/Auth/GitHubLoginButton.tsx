import { getGitHubAuthorizeLoginURL } from '@/utils/auth'
import GitHub from '@mui/icons-material/GitHub'
import type { schemas } from '@polar-sh/client'
import type { ButtonProps } from '@polar-sh/orbit'
import { OAuthLoginButton } from './OAuthLoginButton'

interface GitHubLoginButtonProps {
  authenticationSession: schemas['AuthenticationSession'] | null
  returnTo?: string
  signup?: boolean
  variant?: ButtonProps['variant']
}

const GitHubLoginButton = (props: GitHubLoginButtonProps) => (
  <OAuthLoginButton
    {...props}
    authorizeUrl={getGitHubAuthorizeLoginURL()}
    icon={<GitHub />}
    label="GitHub"
    method="github"
  />
)

export default GitHubLoginButton

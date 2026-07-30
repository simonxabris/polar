import { getAppleAuthorizeURL } from '@/utils/auth'
import Apple from '@mui/icons-material/Apple'
import type { schemas } from '@polar-sh/client'
import type { ButtonProps } from '@polar-sh/orbit'
import { OAuthLoginButton } from './OAuthLoginButton'

interface AppleLoginButtonProps {
  authenticationSession: schemas['AuthenticationSession'] | null
  returnTo?: string
  signup?: boolean
  variant?: ButtonProps['variant']
}

const AppleLoginButton = (props: AppleLoginButtonProps) => (
  <OAuthLoginButton
    {...props}
    authorizeUrl={getAppleAuthorizeURL()}
    icon={<Apple />}
    label="Apple"
    method="apple"
  />
)

export default AppleLoginButton

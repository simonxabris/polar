import { getGoogleAuthorizeLoginURL } from '@/utils/auth'
import Google from '@mui/icons-material/Google'
import type { schemas } from '@polar-sh/client'
import type { ButtonProps } from '@polar-sh/orbit'
import { OAuthLoginButton } from './OAuthLoginButton'

interface GoogleLoginButtonProps {
  authenticationSession: schemas['AuthenticationSession'] | null
  returnTo?: string
  signup?: boolean
  variant?: ButtonProps['variant']
}

const GoogleLoginButton = (props: GoogleLoginButtonProps) => (
  <OAuthLoginButton
    {...props}
    authorizeUrl={getGoogleAuthorizeLoginURL()}
    icon={<Google />}
    label="Google"
    method="google"
  />
)

export default GoogleLoginButton

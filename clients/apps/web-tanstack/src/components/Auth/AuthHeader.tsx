import { PolarLogotype } from '@/components/Layout/Public/PolarLogotype'
import { CONFIG } from '@/utils/config'
import { Alert, Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'

const AuthHeader = ({ error }: { error?: string }) => (
  <Box flexDirection="column" rowGap="l">
    <PolarLogotype logoVariant="icon" size={60} />
    <Box flexDirection="column" rowGap="l">
      <Text variant="heading-xs" as="h1">
        {CONFIG.IS_SANDBOX
          ? 'Welcome to the Polar Sandbox'
          : 'Welcome to Polar'}
      </Text>
      <Text variant="body" color="muted">
        {CONFIG.IS_SANDBOX
          ? 'This is a testing environment. Changes here won’t affect your live account and payments are not processed.'
          : 'Monetize your software'}
      </Text>
    </Box>
    {error ? <Alert variant="danger" title={error} /> : null}
  </Box>
)

export default AuthHeader

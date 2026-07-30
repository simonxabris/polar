import { Box } from '@polar-sh/orbit/Box'
import type { ReactNode } from 'react'

export const AuthPageShell = ({ children }: { children: ReactNode }) => (
  <Box
    minHeight="100vh"
    width="100%"
    flexGrow={1}
    alignItems="center"
    justifyContent="center"
    padding="l"
  >
    <Box
      flexDirection="column"
      rowGap="2xl"
      width="100%"
      maxWidth={448}
      backgroundColor="background-secondary"
      borderRadius="xl"
      padding={{ base: 'xl', md: '3xl' }}
    >
      {children}
    </Box>
  </Box>
)

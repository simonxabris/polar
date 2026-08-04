import LogoIcon from '@/components/Brand/logos/LogoIcon'
import { usePostHog } from '@/hooks/posthog'
import { CONFIG } from '@/utils/config'
import { Text } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import { Link, getRouteApi } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { APIPreview } from './APIPreview'

const authenticatedRoute = getRouteApi('/_authenticated')

export function OnboardingShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  const { user } = authenticatedRoute.useRouteContext()
  const posthog = usePostHog()
  const [hadOrganizations] = useState(() => Boolean(user.organizations?.length))

  return (
    <Box
      minHeight="100vh"
      justifyContent="center"
      backgroundColor="background-primary"
      overflowX="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        bottom={24}
        left={24}
        gap="l"
        color="text-tertiary"
      >
        {hadOrganizations ? (
          <Link
            to="/dashboard"
            search={{}}
            className="dark:hover:text-polar-200 text-sm hover:text-gray-900"
          >
            Back to dashboard
          </Link>
        ) : null}
        <a
          href="/dashboard/account/preferences"
          className="dark:hover:text-polar-200 text-sm hover:text-gray-900"
        >
          User settings
        </a>
        <button
          type="button"
          onClick={() => {
            posthog.reset()
            window.location.href = `${CONFIG.BASE_URL}/v1/auth/logout`
          }}
          className="dark:hover:text-polar-200 cursor-pointer text-sm hover:text-gray-900"
        >
          Log out
        </button>
      </Box>

      <Box width="100%" maxWidth="60rem">
        <Box
          flex={1}
          flexDirection="column"
          alignItems="center"
          paddingTop="5xl"
          paddingBottom="3xl"
          paddingHorizontal={{ base: 'l', lg: 'none' }}
        >
          <motion.div
            key="product"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-md flex-col gap-y-8"
          >
            <Box position="relative" flexDirection="column" rowGap="xl">
              <Box flexDirection="column" rowGap="xl">
                <Box alignItems="center" justifyContent="center">
                  <button
                    type="button"
                    onClick={() =>
                      window.location.assign('/onboarding/business')
                    }
                    className="dark:text-polar-400 dark:hover:text-polar-200 absolute left-0 text-gray-400 hover:text-gray-900"
                    aria-label="Back to business details"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <LogoIcon size={36} />
                </Box>
                <Box width="100%" alignItems="center" gap="s">
                  {['personal', 'business', 'product'].map((step) => (
                    <Box key={step} flex={1}>
                      <Box
                        display="block"
                        height={2}
                        width="100%"
                        borderRadius="full"
                        backgroundColor="background-inverse"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box flexDirection="column" rowGap="m">
                <Text variant="heading-s">{title}</Text>
                {subtitle ? (
                  <Text variant="body" color="muted">
                    {subtitle}
                  </Text>
                ) : null}
              </Box>
              {children}
            </Box>
          </motion.div>
        </Box>

        <Box
          position="relative"
          display={{ base: 'none', lg: 'flex' }}
          width="40%"
          maxWidth="28rem"
          flexDirection="column"
          paddingHorizontal="2xl"
          paddingTop="5xl"
          paddingBottom="3xl"
        >
          <Box
            display="block"
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={-10000}
            backgroundColor="background-secondary"
          />
          <Box display="block" position="sticky" top={150} zIndex={1}>
            <APIPreview />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

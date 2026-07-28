import { StartupProgramPage } from '@/components/Landing/startup-program/StartupProgramPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/startup-program')({
  head: () =>
    getMarketingHead({
      title: 'Polar Startup Program',
      description:
        'Scale-tier pricing for a full year, free. For AI and SaaS startups building on Polar.',
    }),
  component: StartupProgramPage,
})

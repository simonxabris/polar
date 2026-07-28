import { TrialsPage } from '@/components/Landing/features/TrialsPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/trials')({
  head: () =>
    getMarketingHead({
      title: 'Free Trials',
      description:
        'Free or paid trials with automatic conversion, conversion reminders, and abuse protection — built into your subscriptions.',
      keywords:
        'free trial, trial period, trial conversion, trial abuse prevention, saas trial',
    }),
  component: TrialsPage,
})

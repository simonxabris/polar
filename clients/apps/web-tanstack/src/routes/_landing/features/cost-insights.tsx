import { CostInsightsPage } from '@/components/Landing/features/CostInsightsPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/cost-insights')({
  head: () =>
    getMarketingHead({
      title: 'Cost Insights',
      description:
        'Track cost, profit, and customer LTV by annotating events with cost data.',
      keywords:
        'cost insights, profit tracking, LTV, customer lifetime value, cost events, llm cost tracking',
    }),
  component: CostInsightsPage,
})

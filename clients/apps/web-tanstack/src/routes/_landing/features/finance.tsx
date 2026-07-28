import { FinancePage } from '@/components/Landing/features/FinancePage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/finance')({
  head: () =>
    getMarketingHead({
      title: 'Finance & Payouts',
      description:
        'Live balance, transactions ledger, transparent fees, and manual payouts. All visible.',
      keywords:
        'finance, payouts, transactions, ledger, balance, fees, stripe connect, multi-currency',
    }),
  component: FinancePage,
})

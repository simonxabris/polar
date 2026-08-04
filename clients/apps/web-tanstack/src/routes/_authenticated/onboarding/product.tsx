import { ProductDetailsStep } from '@/components/Onboarding/ProductDetailsStep'
import { CONFIG } from '@/utils/config'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/onboarding/product')({
  head: () => ({ meta: [{ title: 'Polar' }] }),
  beforeLoad: () => {
    if (CONFIG.IS_SANDBOX) {
      throw redirect({ href: '/onboarding/sandbox' })
    }
  },
  component: ProductDetailsStep,
})

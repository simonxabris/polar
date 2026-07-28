import { MerchantOfRecordPage } from '@/components/Landing/features/MerchantOfRecordPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/merchant-of-record')({
  head: () =>
    getMarketingHead({
      title: 'Merchant of Record',
      description:
        'Polar is your reseller. We handle international sales taxes globally so you can focus on the product.',
      keywords:
        'merchant of record, MoR, sales tax, VAT, GST, international taxes, reseller, EU OSS, tax compliance',
    }),
  component: MerchantOfRecordPage,
})

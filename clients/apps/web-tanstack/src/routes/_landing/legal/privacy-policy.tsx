import PrivacyPolicy from '@/content/legal/privacy-policy.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/legal/privacy-policy')({
  head: () => ({ meta: [{ title: 'Polar Privacy Policy' }] }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return <PrivacyPolicy components={mdxComponents} />
}

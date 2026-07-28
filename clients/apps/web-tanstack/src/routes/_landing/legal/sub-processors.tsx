import SubProcessors from '@/content/legal/sub-processors.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/legal/sub-processors')({
  head: () => ({ meta: [{ title: 'Polar Sub-processors' }] }),
  component: SubProcessorsPage,
})

function SubProcessorsPage() {
  return <SubProcessors components={mdxComponents} />
}

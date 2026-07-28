import DataProcessingAddendum from '@/content/legal/data-processing-addendum.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_landing/legal/data-processing-addendum',
)({
  head: () => ({ meta: [{ title: 'Polar Data Processing Addendum' }] }),
  component: DataProcessingAddendumPage,
})

function DataProcessingAddendumPage() {
  return <DataProcessingAddendum components={mdxComponents} />
}

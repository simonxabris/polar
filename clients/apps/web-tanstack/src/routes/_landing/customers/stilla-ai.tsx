import { ArticleLayout } from '@/components/Layout/Public/ArticleLayout'
import ProseWrapper from '@/components/MDX/ProseWrapper'
import StillaAIStory from '@/content/customers/stilla-ai/page.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/customers/stilla-ai')({
  head: () => ({
    meta: [
      {
        title: 'How Stilla AI implemented production-ready billing in hours',
      },
      {
        name: 'description',
        content:
          "Polar gave us production-ready billing in hours, instead of weeks. That's rare.",
      },
    ],
  }),
  component: StillaAIStoryPage,
})

function StillaAIStoryPage() {
  return (
    <ArticleLayout>
      <ProseWrapper>
        <StillaAIStory components={mdxComponents} />
      </ProseWrapper>
    </ArticleLayout>
  )
}

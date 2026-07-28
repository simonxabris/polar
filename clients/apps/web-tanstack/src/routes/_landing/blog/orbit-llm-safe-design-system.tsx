import { BlogPostLayout } from '@/components/Blog/BlogPostLayout'
import Post from '@/content/blog/orbit-llm-safe-design-system.mdx'
import { mdxComponents } from '@/mdx-components'
import { getBlogPostHead } from '@/utils/blog'
import { createFileRoute } from '@tanstack/react-router'

const slug = 'orbit-llm-safe-design-system'

export const Route = createFileRoute(
  '/_landing/blog/orbit-llm-safe-design-system',
)({
  head: () => getBlogPostHead(slug),
  component: BlogPost,
})

function BlogPost() {
  return (
    <BlogPostLayout>
      <Post components={mdxComponents} />
    </BlogPostLayout>
  )
}

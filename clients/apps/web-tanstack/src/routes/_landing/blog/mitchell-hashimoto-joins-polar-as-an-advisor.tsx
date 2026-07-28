import { BlogPostLayout } from '@/components/Blog/BlogPostLayout'
import Post from '@/content/blog/mitchell-hashimoto-joins-polar-as-an-advisor.mdx'
import { mdxComponents } from '@/mdx-components'
import { getBlogPostHead } from '@/utils/blog'
import { createFileRoute } from '@tanstack/react-router'

const slug = 'mitchell-hashimoto-joins-polar-as-an-advisor'

export const Route = createFileRoute(
  '/_landing/blog/mitchell-hashimoto-joins-polar-as-an-advisor',
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

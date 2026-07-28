import { BlogPostLayout } from '@/components/Blog/BlogPostLayout'
import Post from '@/content/blog/introducing-polar-plans.mdx'
import { mdxComponents } from '@/mdx-components'
import { getBlogPostHead } from '@/utils/blog'
import { createFileRoute } from '@tanstack/react-router'

const slug = 'introducing-polar-plans'

export const Route = createFileRoute('/_landing/blog/introducing-polar-plans')({
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

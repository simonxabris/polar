import { BlogPostLayout } from '@/components/Blog/BlogPostLayout'
import Post from '@/content/blog/prompt-a-startup-2026.mdx'
import { mdxComponents } from '@/mdx-components'
import { getBlogPostHead } from '@/utils/blog'
import { createFileRoute } from '@tanstack/react-router'

const slug = 'prompt-a-startup-2026'

export const Route = createFileRoute('/_landing/blog/prompt-a-startup-2026')({
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

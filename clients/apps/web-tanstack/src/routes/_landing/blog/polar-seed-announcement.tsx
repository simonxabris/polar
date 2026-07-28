import { BlogPostLayout } from '@/components/Blog/BlogPostLayout'
import Post from '@/content/blog/polar-seed-announcement.mdx'
import { mdxComponents } from '@/mdx-components'
import { getBlogPostHead } from '@/utils/blog'
import { createFileRoute } from '@tanstack/react-router'

const slug = 'polar-seed-announcement'

export const Route = createFileRoute('/_landing/blog/polar-seed-announcement')({
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

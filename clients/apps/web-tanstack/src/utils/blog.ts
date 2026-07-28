import { contentPosts } from '@/content/posts'
import { getArticleHead } from '@/utils/metadata'

export function getBlogPostHead(slug: string) {
  const post = contentPosts.find(
    (contentPost) => contentPost.type === 'blog' && contentPost.slug === slug,
  )

  if (!post) {
    throw new Error(`Missing blog post metadata for ${slug}`)
  }

  return getArticleHead({
    title: post.title,
    description: post.description,
    image: new URL(post.image, 'https://polar.sh').href,
    publishedTime: post.date,
  })
}

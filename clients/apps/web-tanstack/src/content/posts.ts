export interface ContentPost {
  slug: string
  title: string
  date: string
  image: string
  type: 'blog' | 'story'
  href: string
}

export const contentPosts: ContentPost[] = [
  {
    slug: 'orbit-llm-safe-design-system',
    title: 'Building an LLM safe design system',
    date: '2026-06-16T12:00:00.000000+00:00',
    image: '/posts/blog/orbit-llm-safe-design-system/cover.jpg',
    type: 'blog',
    href: '/blog/orbit-llm-safe-design-system',
  },
  {
    slug: 'introducing-polar-plans',
    title: 'Introducing Polar Plans',
    date: '2026-05-20T12:00:00.000000+00:00',
    image: '/posts/blog/introducing-polar-plans/pricing.jpg',
    type: 'blog',
    href: '/blog/introducing-polar-plans',
  },
  {
    slug: 'prompt-a-startup-2026',
    title: 'We held a hackathon at a luxury spa',
    date: '2026-03-13',
    image: '/posts/blog/prompt-a-startup-2026/01.jpg',
    type: 'blog',
    href: '/blog/prompt-a-startup-2026',
  },
  {
    slug: 'stilla-ai',
    title: 'How Stilla AI implemented production-ready billing in hours',
    date: '2025-11-01',
    image: '/posts/story/stilla-ai/stilla.jpg',
    type: 'story',
    href: '/customers/stilla-ai',
  },
  {
    slug: 'polar-seed-announcement',
    title: 'Announcing our $10M Seed Round',
    date: '2025-06-17',
    image: '/posts/blog/polar-seed-announcement/seed.jpg',
    type: 'blog',
    href: '/blog/polar-seed-announcement',
  },
  {
    slug: 'mitchell-hashimoto-joins-polar-as-an-advisor',
    title: 'Mitchell Hashimoto joins Polar as an advisor',
    date: '2024-04-02T13:45:56.717983+00:00',
    image:
      '/posts/blog/mitchell-hashimoto-joins-polar-as-an-advisor/abstract_02.jpg',
    type: 'blog',
    href: '/blog/mitchell-hashimoto-joins-polar-as-an-advisor',
  },
]

export interface ContentPost {
  slug: string
  title: string
  description: string
  date: string
  image: string
  type: 'blog' | 'story'
  href: string
}

export const contentPosts: ContentPost[] = [
  {
    slug: 'orbit-llm-safe-design-system',
    title: 'Building an LLM safe design system',
    description: 'Our quest to build a scalable, LLM-safe design system',
    date: '2026-06-16T12:00:00.000000+00:00',
    image: '/posts/blog/orbit-llm-safe-design-system/cover.jpg',
    type: 'blog',
    href: '/blog/orbit-llm-safe-design-system',
  },
  {
    slug: 'introducing-polar-plans',
    title: 'Introducing Polar Plans',
    description:
      "Starting today, we're introducing three optional paid plans: Pro, Growth, and Scale.",
    date: '2026-05-20T12:00:00.000000+00:00',
    image: '/posts/blog/introducing-polar-plans/pricing.jpg',
    type: 'blog',
    href: '/blog/introducing-polar-plans',
  },
  {
    slug: 'prompt-a-startup-2026',
    title: 'We held a hackathon at a luxury spa',
    description:
      'We gathered 40 builders at Yasuragi Spa & Hotel in the Stockholm archipelago for a 24 hour hackathon.',
    date: '2026-03-13',
    image: '/posts/blog/prompt-a-startup-2026/01.jpg',
    type: 'blog',
    href: '/blog/prompt-a-startup-2026',
  },
  {
    slug: 'stilla-ai',
    title: 'How Stilla AI implemented production-ready billing in hours',
    description:
      "Polar gave us production-ready billing in hours, instead of weeks. That's rare.",
    date: '2025-11-01',
    image: '/posts/story/stilla-ai/stilla.jpg',
    type: 'story',
    href: '/customers/stilla-ai',
  },
  {
    slug: 'polar-seed-announcement',
    title: 'Announcing our $10M Seed Round',
    description:
      "We're thrilled to announce our $10M Seed round led by Accel, with continued support from Abstract & Mischief, alongside an exceptional group of angels",
    date: '2025-06-17',
    image: '/posts/blog/polar-seed-announcement/seed.jpg',
    type: 'blog',
    href: '/blog/polar-seed-announcement',
  },
  {
    slug: 'mitchell-hashimoto-joins-polar-as-an-advisor',
    title: 'Mitchell Hashimoto joins Polar as an advisor',
    description:
      "Today, we're honoured to announce that Mitchell Hashimoto is joining Polar as an advisor!",
    date: '2024-04-02T13:45:56.717983+00:00',
    image:
      '/posts/blog/mitchell-hashimoto-joins-polar-as-an-advisor/abstract_02.jpg',
    type: 'blog',
    href: '/blog/mitchell-hashimoto-joins-polar-as-an-advisor',
  },
]

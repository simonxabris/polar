import { ArticleLayout } from '@/components/Layout/Public/ArticleLayout'
import ProseWrapper from '@/components/MDX/ProseWrapper'
import { PropsWithChildren } from 'react'

export function BlogPostLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center md:w-full">
      <ProseWrapper className="flex max-w-full min-w-0 flex-col items-center md:w-full lg:max-w-6xl!">
        <ArticleLayout>{children}</ArticleLayout>
      </ProseWrapper>
    </div>
  )
}

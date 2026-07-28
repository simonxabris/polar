import { ArticleLayout } from '@/components/Layout/Public/ArticleLayout'
import ProseWrapper from '@/components/MDX/ProseWrapper'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/legal')({
  component: LegalLayout,
})

function LegalLayout() {
  return (
    <div className="flex flex-col items-center md:w-full">
      <ProseWrapper className="flex max-w-full min-w-0 flex-col items-center md:w-full lg:max-w-6xl!">
        <ArticleLayout>
          <Outlet />
        </ArticleLayout>
      </ProseWrapper>
    </div>
  )
}

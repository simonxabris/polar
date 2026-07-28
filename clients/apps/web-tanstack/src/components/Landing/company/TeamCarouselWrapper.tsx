import { ClientOnly } from '@tanstack/react-router'
import { TeamCarousel } from './TeamCarousel'

export function TeamCarouselWrapper() {
  return (
    <ClientOnly fallback={<div className="h-[115px] w-full md:h-[269px]" />}>
      <TeamCarousel />
    </ClientOnly>
  )
}

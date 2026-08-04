import { OnboardingProvider } from '@/components/Onboarding/OnboardingContext'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/onboarding')({
  component: OnboardingLayout,
})

function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  )
}

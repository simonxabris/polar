import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'polar_onboarding_v2'

export interface OnboardingData {
  firstName?: string
  lastName?: string
  country?: string
  dateOfBirth?: string
  organizationType?: 'individual' | 'company'
  orgName?: string
  orgSlug?: string
  supportEmail?: string
  businessCountry?: string
  registeredBusinessName?: string
  defaultCurrency?: string
  organizationId?: string
  sellingCategories?: string[]
  productDescription?: string
  pricingModel?: string[]
  currentlySellingOn?: string[]
  productUrl?: string
}

function loadFromSession(): OnboardingData {
  if (typeof window === 'undefined') return {}
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveToSession(data: OnboardingData): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    return
  }
}

interface OnboardingContextValue {
  getData: () => OnboardingData
  updateData: (partial: Partial<OnboardingData>) => void
  subscribe: (listener: () => void) => () => void
  setApiLoading: (loading: boolean) => void
  showApiResponse: (status: number, message: string) => Promise<void>
  clearApiResponse: () => void
  apiLoading: boolean
  apiResponse: { status: number; message: string } | null
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const dataRef = useRef<OnboardingData>(loadFromSession())
  const listenersRef = useRef(new Set<() => void>())
  const [apiLoading, setApiLoadingState] = useState(false)
  const [apiResponse, setApiResponse] = useState<{
    status: number
    message: string
  } | null>(null)

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener)
    return () => listenersRef.current.delete(listener)
  }, [])
  const getData = useCallback(() => dataRef.current, [])
  const updateData = useCallback((partial: Partial<OnboardingData>) => {
    dataRef.current = { ...dataRef.current, ...partial }
    saveToSession(dataRef.current)
    for (const listener of listenersRef.current) listener()
  }, [])
  const setApiLoading = useCallback((loading: boolean) => {
    setApiLoadingState(loading)
    if (loading) setApiResponse(null)
  }, [])
  const clearApiResponse = useCallback(() => setApiResponse(null), [])
  const showApiResponse = useCallback((status: number, message: string) => {
    setApiLoadingState(false)
    setApiResponse({ status, message })
    if (status >= 400) return Promise.resolve()
    return new Promise<void>((resolve) => setTimeout(resolve, 2500))
  }, [])

  const value = useMemo(
    () => ({
      getData,
      updateData,
      subscribe,
      setApiLoading,
      showApiResponse,
      clearApiResponse,
      apiLoading,
      apiResponse,
    }),
    [
      getData,
      updateData,
      subscribe,
      setApiLoading,
      showApiResponse,
      clearApiResponse,
      apiLoading,
      apiResponse,
    ],
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

function useOnboardingContext() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('Onboarding hooks must be used within OnboardingProvider')
  }
  return context
}

export function useOnboardingData() {
  const context = useOnboardingContext()
  return {
    data: context.getData(),
    updateData: context.updateData,
    setApiLoading: context.setApiLoading,
    showApiResponse: context.showApiResponse,
    clearApiResponse: context.clearApiResponse,
    apiLoading: context.apiLoading,
    apiResponse: context.apiResponse,
  }
}

export function useOnboardingDataLive(): OnboardingData {
  const context = useOnboardingContext()
  return useSyncExternalStore(
    context.subscribe,
    context.getData,
    context.getData,
  )
}

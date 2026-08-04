import { api } from '@/utils/client'
import {
  NotFoundResponseError,
  UnauthorizedResponseError,
  type schemas,
  unwrap,
} from '@polar-sh/client'
import { useQuery, skipToken } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { useSyncExternalStore } from 'react'

const retry = (failureCount: number, error: Error) =>
  !(error instanceof UnauthorizedResponseError) &&
  !(error instanceof NotFoundResponseError) &&
  failureCount <= 2

const isNotifiable = (message: schemas['SupportCaseMessage']) =>
  message.author_kind !== 'merchant' &&
  message.type !== 'opened' &&
  message.type !== 'closed'

const storageKey = (organizationId: string) =>
  `polar:appeal-case-seen:${organizationId}`

const SEEN_EVENT = 'polar:appeal-case-seen'

const getSeenCount = (organizationId: string) => {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(storageKey(organizationId))
  const parsed = raw === null ? 0 : parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

const subscribe = (callback: () => void) => {
  window.addEventListener(SEEN_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(SEEN_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

const useAppealCaseUnreadCount = (
  organization: schemas['Organization'],
): number => {
  const pollInterval = 60_000
  const enabled = organization.status === 'denied'
  const reviewStatus = useQuery({
    queryKey: ['organizationReviewStatus', organization.id],
    queryFn: () =>
      unwrap(
        api.GET('/v1/organizations/{id}/review-status', {
          params: { path: { id: organization.id } },
        }),
      ),
    retry,
    enabled,
    refetchInterval: pollInterval,
  })
  const caseId = reviewStatus.data?.appeal_case_id ?? undefined
  const supportCase = useQuery({
    queryKey: ['supportCase', caseId],
    queryFn: caseId
      ? () =>
          unwrap(
            api.GET('/v1/support-cases/{id}', {
              params: { path: { id: caseId } },
            }),
          )
      : skipToken,
    retry,
    enabled,
    refetchInterval: (query) => {
      if (!query.state.data?.is_open) return false
      const hidden = typeof document !== 'undefined' && document.hidden
      return hidden ? Math.max(pollInterval, 30_000) : pollInterval
    },
    refetchIntervalInBackground: true,
  })
  const seen = useSyncExternalStore(
    subscribe,
    () => getSeenCount(organization.id),
    () => 0,
  )
  const notifiable = (supportCase.data?.messages ?? []).filter(
    isNotifiable,
  ).length
  return Math.max(0, notifiable - seen)
}

export const AppealCaseUnreadBadge = ({
  organization,
}: {
  organization: schemas['Organization']
}) => {
  const unread = useAppealCaseUnreadCount(organization)
  if (unread === 0) return null

  return (
    <motion.span
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-label="Unread support messages"
      className="bg-blue h-1.5 w-1.5 rounded-full"
    />
  )
}

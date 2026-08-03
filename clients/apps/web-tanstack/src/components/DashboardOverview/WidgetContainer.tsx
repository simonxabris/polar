import type { PropsWithChildren, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export const dashboardWidgetCellClassName =
  'dark:border-polar-700 border-t-0 border-r border-b border-l-0 border-gray-200'

export const WidgetContainer = ({
  action,
  children,
  className,
  title,
}: PropsWithChildren<{
  action?: ReactNode
  className?: string
  title: string
}>) => (
  <div
    className={twMerge(
      'flex max-h-96 flex-col gap-6 overflow-hidden',
      className,
    )}
  >
    <div className="flex shrink-0 items-center justify-between px-6 pt-6">
      <h3 className="text-lg">{title}</h3>
      {action && <div>{action}</div>}
    </div>
    <div className="flex flex-1 flex-col overflow-y-auto px-6">{children}</div>
  </div>
)

export const EmptyWidgetState = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <div className="dark:bg-polar-800 mb-6 flex flex-1 flex-col items-center justify-center gap-y-2 rounded-lg bg-gray-50 p-8 text-center">
    <h3>{title}</h3>
    <p className="dark:text-polar-500 text-sm text-gray-500">{description}</p>
  </div>
)

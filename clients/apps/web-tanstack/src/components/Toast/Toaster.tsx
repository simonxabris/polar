import { useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '.'
import { useToast } from './use-toast'

export function Toaster() {
  const { toast, toasts } = useToast()
  const location = useLocation()
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.searchStr)
    const isToastRedirection = searchParams.get('toast')
    if (isToastRedirection !== 'true') {
      return
    }

    const status = searchParams.get('status')
    const statusDescription = searchParams.get('status_description')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    if (error || status) {
      toast({
        title: error
          ? (error ?? 'Hmm... Something went wrong.')
          : (status ?? 'Alright!'),
        description: error ? errorDescription : statusDescription,
        variant: error ? 'error' : undefined,
        duration: 3000,
      })
      const paramsToRemove = [
        'toast',
        'error',
        'status',
        'status_description',
        'error_description',
      ]
      paramsToRemove.forEach((param) => searchParams.delete(param))
      const search = searchParams.toString()
      router.history.replace(
        `${location.pathname}${search ? `?${search}` : ''}${location.hash}`,
      )
    }
  }, [location, router, toast])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

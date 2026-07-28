'use client'

import { usePostHog, type EventName } from '@/hooks/posthog'
import { Button, Input } from '@polar-sh/orbit'
import { useState, type FormEvent } from 'react'

interface EmailOTPFormProps {
  authenticationSession: unknown | null
  returnTo?: string
  signup?: boolean
}

const EmailOTPForm = ({ signup }: EmailOTPFormProps) => {
  const [email, setEmail] = useState('')
  const posthog = usePostHog()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    let eventName: EventName = 'global:user:login:submit'
    if (signup) {
      eventName = 'global:user:signup:submit'
    }
    posthog.capture(eventName, {
      method: 'email_otp',
    })

    // NOTE: email OTP is not wired up yet in this app — the form is UI-only
    // for now, matching the rest of the (non-functional) auth modal.
  }

  return (
    <form className="flex w-full flex-col" onSubmit={onSubmit}>
      <div className="flex w-full flex-col gap-2">
        <Input
          type="email"
          required
          placeholder="Email"
          autoComplete="off"
          data-1p-ignore
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="secondary" fullWidth>
          {signup ? 'Sign up with email' : 'Sign in with email'}
        </Button>
      </div>
    </form>
  )
}

export default EmailOTPForm

import { getServerSideAPI } from '@/utils/client.server'
import * as Sentry from '@sentry/react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const MAX_DESCRIPTION_LENGTH = 3000
const MAX_HISTORY_LENGTH = 5
const MAX_CATEGORY_LENGTH = 100
const MAX_CATEGORIES = 10

const requestSchema = z.object({
  conversation_id: z.string().min(1).max(64),
  product_description: z.string().max(MAX_DESCRIPTION_LENGTH),
  selling_categories: z
    .array(z.string().max(MAX_CATEGORY_LENGTH))
    .max(MAX_CATEGORIES),
  pricing_models: z
    .array(z.string().max(MAX_CATEGORY_LENGTH))
    .max(MAX_CATEGORIES),
  history: z
    .array(
      z.object({
        product_description: z.string().max(MAX_DESCRIPTION_LENGTH),
        verdict: z.string(),
        message: z.string().max(500).optional(),
      }),
    )
    .max(MAX_HISTORY_LENGTH)
    .optional(),
})

export const Route = createFileRoute(
  '/_authenticated/onboarding/validate-description',
)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { data: user } = await getServerSideAPI().GET('/v1/users/me', {
          cache: 'no-cache',
        })
        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!process.env.PYDANTIC_AI_GATEWAY_API_KEY) {
          return Response.json({ verdict: 'APPROVE', confidence: 1 })
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const parsed = requestSchema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }

        const {
          conversation_id,
          product_description,
          selling_categories,
          pricing_models,
          history,
        } = parsed.data

        try {
          const { reviewProduct } =
            await import('@/utils/aup-validation.server')
          const output = await reviewProduct({
            userId: user.id,
            conversationId: conversation_id,
            productDescription: product_description,
            sellingCategories: selling_categories,
            pricingModels: pricing_models,
            history,
          })
          return Response.json(output)
        } catch (error) {
          console.error('[validate-description] Failed:', error)
          Sentry.captureException(error)
          return Response.json(
            { error: 'Validation service unavailable' },
            { status: 502 },
          )
        }
      },
    },
  },
})

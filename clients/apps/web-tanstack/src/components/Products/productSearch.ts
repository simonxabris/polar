import { z } from 'zod'

export const productSortingSchema = z.enum([
  'name',
  '-name',
  '-created_at',
  'created_at',
  'price_amount',
  '-price_amount',
])

export const productVisibilitySchema = z.enum(['all', 'active', 'archived'])

export const productSearchSchema = z.object({
  page: z.number().int().positive().optional().catch(undefined),
  limit: z
    .union([z.literal(20), z.literal(50), z.literal(100)])
    .optional()
    .catch(undefined),
  sorting: productSortingSchema.optional().catch(undefined),
  query: z.string().optional().catch(undefined),
  show: productVisibilitySchema.optional().catch(undefined),
})

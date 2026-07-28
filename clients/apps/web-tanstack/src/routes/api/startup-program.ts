import { addToList, createPerson, upsertCompany } from '@/utils/attio.server'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const requestSchema = z.object({
  startupName: z.string().min(1).max(200),
  industry: z.string().max(200).optional().default(''),
  website: z.string().max(500).optional().default(''),
  foundedAt: z.string().max(50).optional().default(''),
  funding: z.string().max(100).optional().default(''),
  partner: z.string().max(100).optional().default(''),
  partnerOther: z.string().max(200).optional().default(''),
  paymentVolume: z.string().max(200).optional().default(''),
  currentBillingPlatform: z.string().max(100).optional().default(''),
  currentBillingPlatformOther: z.string().max(200).optional().default(''),
  polarOrgSlug: z.string().max(200).optional().default(''),
  teamSize: z.string().max(50).optional().default(''),
  location: z.string().max(200).optional().default(''),
  pitch: z.string().max(2000).optional().default(''),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.string().max(100).optional().default(''),
  email: z.email().max(200),
})

const selectValue = (title: string) => [{ option: title }]

const buildEntryValues = (
  data: z.infer<typeof requestSchema>,
  personRecordId: string,
): Record<string, unknown> => {
  const values: Record<string, unknown> = {}

  if (data.industry) values.industry = data.industry
  if (data.foundedAt) values.founded = data.foundedAt
  if (data.paymentVolume) values.payment_volume = data.paymentVolume
  if (data.location) values.location = data.location
  if (data.pitch) values.pitch = data.pitch
  if (data.currentBillingPlatform === 'Polar' && data.polarOrgSlug) {
    values.polar_org_slug = data.polarOrgSlug
  }
  if (data.funding) values.funding_raised = selectValue(data.funding)
  if (data.partner) values.partner = selectValue(data.partner)
  if (data.teamSize) values.team_size = selectValue(data.teamSize)
  if (data.currentBillingPlatform) {
    values.current_billing_platform = selectValue(data.currentBillingPlatform)
  }
  if (data.partner === 'Other' && data.partnerOther) {
    values.partner_other = data.partnerOther
  }
  if (
    data.currentBillingPlatform === 'Other' &&
    data.currentBillingPlatformOther
  ) {
    values.current_billing_platform_other = data.currentBillingPlatformOther
  }

  values.applicant = [
    { target_object: 'people', target_record_id: personRecordId },
  ]

  return values
}

export const Route = createFileRoute('/api/startup-program')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const startedAt = Date.now()
        const requestId =
          request.headers.get('x-request-id') ?? crypto.randomUUID()
        const finish = (
          response: Response,
          outcome: string,
          context: Record<string, unknown> = {},
        ) => {
          console.info({
            event: 'startup_program_submission',
            request_id: requestId,
            method: request.method,
            path: '/api/startup-program',
            outcome,
            status_code: response.status,
            duration_ms: Date.now() - startedAt,
            environment: process.env.VERCEL_ENV ?? 'development',
            region: process.env.VERCEL_REGION,
            commit_sha: process.env.VERCEL_GIT_COMMIT_SHA,
            ...context,
          })
          return response
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return finish(
            Response.json({ error: 'Invalid JSON' }, { status: 400 }),
            'invalid_json',
          )
        }

        const parsed = requestSchema.safeParse(body)
        if (!parsed.success) {
          return finish(
            Response.json(
              { error: 'Invalid request', issues: parsed.error.issues },
              { status: 400 },
            ),
            'invalid_request',
            { validation_issue_count: parsed.error.issues.length },
          )
        }

        const data = parsed.data
        const listId = process.env.ATTIO_STARTUP_LIST_ID
        if (!process.env.ATTIO_API_KEY || !listId) {
          return finish(
            Response.json(
              { error: 'Submission service is not configured' },
              { status: 500 },
            ),
            'not_configured',
            {
              has_attio_api_key: Boolean(process.env.ATTIO_API_KEY),
              has_attio_list_id: Boolean(listId),
            },
          )
        }

        try {
          const company = await upsertCompany({
            name: data.startupName,
            website: data.website,
          })
          const person = await createPerson({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            jobTitle: data.role,
            companyRecordId: company.id.record_id,
          })
          const entry = await addToList({
            listId,
            parentRecordId: company.id.record_id,
            parentObject: 'companies',
            entryValues: buildEntryValues(data, person.id.record_id),
          })

          return finish(
            Response.json({ ok: true, forwarded: true }),
            'success',
            {
              company_record_id: company.id.record_id,
              person_record_id: person.id.record_id,
              entry_record_id: entry.id.record_id,
              funding: data.funding,
              team_size: data.teamSize,
              billing_platform: data.currentBillingPlatform,
            },
          )
        } catch (error) {
          return finish(
            Response.json(
              { error: 'Failed to submit application' },
              { status: 502 },
            ),
            'attio_error',
            {
              error_type:
                error instanceof Error ? error.constructor.name : 'Unknown',
              error_message:
                error instanceof Error ? error.message : String(error),
            },
          )
        }
      },
    },
  },
})

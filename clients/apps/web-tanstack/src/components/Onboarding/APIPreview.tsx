import { type schemas } from '@polar-sh/client'
import { Box } from '@polar-sh/orbit/Box'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useOnboardingData, useOnboardingDataLive } from './OnboardingContext'
import { PreviewJson, buildPreviewLines } from './APIPreviewJson'

function toSnakeCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export function APIPreview() {
  const data = useOnboardingDataLive()
  const { apiLoading, apiResponse, clearApiResponse } = useOnboardingData()

  useEffect(() => clearApiResponse(), [clearApiResponse])

  const body = useMemo(() => {
    const object: Record<string, unknown> = {
      default_presentment_currency: data.defaultCurrency || 'usd',
    }
    if (data.orgName) object.name = data.orgName
    if (data.orgSlug) object.slug = data.orgSlug
    if (data.businessCountry) object.country = data.businessCountry
    object.legal_entity =
      data.organizationType === 'company' && data.registeredBusinessName
        ? {
            type: 'company' as const,
            registered_name: data.registeredBusinessName,
          }
        : { type: 'individual' as const }
    if (data.supportEmail) object.email = data.supportEmail
    if (data.productUrl) object.website = data.productUrl

    const product: Record<string, unknown> = {}
    if (data.sellingCategories?.length) {
      product.type = data.sellingCategories.map(toSnakeCase)
    }
    if (data.pricingModel?.length) {
      product.model = data.pricingModel.map(toSnakeCase)
    }
    if (data.productDescription) product.description = data.productDescription
    if (Object.keys(product).length > 0) object.product = product

    if ((data.currentlySellingOn?.length ?? 0) > 0) {
      object.switching = true
      object.switching_from = data
        .currentlySellingOn?.[0] as schemas['OrganizationDetails']['switching_from']
    }
    return object
  }, [data])

  const lines = useMemo(() => buildPreviewLines(body), [body])
  const contentLength = useMemo(
    () => new TextEncoder().encode(JSON.stringify(body, null, 2)).length,
    [body],
  )
  const previousFingerprints = useRef(new Map<string, string>())
  const pendingChanges = useRef(new Set<string>())
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [flashedKeys, setFlashedKeys] = useState(new Set<string>())

  useEffect(() => {
    const previous = previousFingerprints.current
    for (const line of lines) {
      const oldFingerprint = previous.get(line.key)
      if (oldFingerprint !== undefined && oldFingerprint !== line.fingerprint) {
        pendingChanges.current.add(line.key)
      }
    }
    previousFingerprints.current = new Map(
      lines.map((line) => [line.key, line.fingerprint]),
    )
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      if (pendingChanges.current.size === 0) return
      setFlashedKeys(new Set(pendingChanges.current))
      pendingChanges.current.clear()
      clearTimeout(fadeTimer.current)
      fadeTimer.current = setTimeout(() => setFlashedKeys(new Set()), 800)
    }, 300)
    return () => clearTimeout(debounceTimer.current)
  }, [lines])

  return (
    <Box flexDirection="column">
      <Box
        flexDirection="column"
        rowGap="xs"
        borderBottomWidth={1}
        borderStyle="solid"
        borderColor="border-primary"
        paddingBottom="m"
      >
        <Box alignItems="center" gap="s">
          <p className="font-mono text-[11px] leading-relaxed font-semibold text-green-600 dark:text-green-500">
            POST
          </p>
          <p className="font-mono text-[11px] leading-relaxed text-gray-400 dark:text-gray-600">
            /v1/organizations
          </p>
        </Box>
        <Box flexDirection="column">
          {[
            'Host: api.polar.sh',
            'Content-Type: application/json',
            `Content-Length: ${contentLength}`,
            'Authorization: Bearer polar_sk_Yj1mbihldmVudHMp',
          ].map((header) => (
            <p
              key={header}
              className="font-mono text-[10px] leading-relaxed text-gray-400 dark:text-gray-600"
            >
              {header}
            </p>
          ))}
        </Box>
      </Box>

      <p className="pt-3 pb-2 font-mono text-[10px] leading-relaxed font-medium tracking-wider text-gray-400 uppercase dark:text-gray-600">
        Request Body
      </p>
      <PreviewJson lines={lines} flashedKeys={flashedKeys} />

      {apiLoading ? (
        <Box
          marginTop="m"
          alignItems="center"
          gap="s"
          borderTopWidth={1}
          borderStyle="solid"
          borderColor="border-primary"
          paddingTop="m"
        >
          <Box display="block" height={6} width={6} borderRadius="full" />
          <p className="font-mono text-[10px] leading-relaxed text-gray-400 dark:text-gray-500">
            Sending request...
          </p>
        </Box>
      ) : null}

      {apiResponse ? (
        <Box
          marginTop="m"
          flexDirection="column"
          rowGap="m"
          borderTopWidth={1}
          borderStyle="solid"
          borderColor="border-primary"
          paddingTop="m"
        >
          <Box alignItems="center" gap="s">
            <p
              className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] leading-relaxed font-bold ${
                apiResponse.status >= 400
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}
            >
              {apiResponse.status}
            </p>
            <p className="font-mono text-[10px] leading-relaxed text-gray-500 dark:text-gray-500">
              {apiResponse.message}
            </p>
          </Box>
          {apiResponse.status < 400 ? (
            <>
              <p className="pb-2 font-mono text-[10px] leading-relaxed font-medium tracking-wider text-gray-400 uppercase dark:text-gray-600">
                Response Body
              </p>
              <pre className="font-mono text-[11px] leading-relaxed text-gray-500 dark:text-gray-500">
                {'{\n  '}
                <code className="text-blue-600 dark:text-blue-400">
                  {'"id"'}
                </code>
                <code className="text-gray-400">: </code>
                <code className="text-green-600 dark:text-green-400">
                  {'"org_•••"'}
                </code>
                {',\n  '}
                <code className="text-blue-600 dark:text-blue-400">
                  {'"created_at"'}
                </code>
                <code className="text-gray-400">: </code>
                <code className="text-green-600 dark:text-green-400">
                  {`"${new Date().toISOString().split('.')[0]}Z"`}
                </code>
                {'\n}'}
              </pre>
            </>
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}

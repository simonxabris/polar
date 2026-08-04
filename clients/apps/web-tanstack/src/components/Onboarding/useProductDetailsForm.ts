import { useOnboardingV2Tracking } from '@/hooks/onboardingV2'
import { useAupValidation, type AupVerdict } from '@/hooks/useAupValidation'
import { api } from '@/utils/client'
import { SELLING_CATEGORIES } from '@/utils/productCategories'
import { type schemas } from '@polar-sh/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOnboardingData } from './OnboardingContext'

export interface ProductDetailsFormSchema {
  sellingCategories: string[]
  productDescription: string
  pricingModel: string[]
  supportEmail: string
  productUrl: string
  currentlySellingOn: string[]
}

export const MIN_DESCRIPTION_LENGTH = 30
export const MAX_DESCRIPTION_LENGTH = 3000

export function useProductDetailsForm() {
  const router = useRouter()
  const { data, updateData, setApiLoading, showApiResponse } =
    useOnboardingData()
  const { trackStepViewed, trackStepCompleted } = useOnboardingV2Tracking()
  const createOrganization = useMutation({
    mutationFn: (body: schemas['OrganizationCreate']) =>
      api.POST('/v1/organizations/', { body }),
  })
  const aup = useAupValidation()
  const [loading, setLoading] = useState<
    'submitting' | 'submitting-anyway' | null
  >(null)
  const form = useForm<ProductDetailsFormSchema>({
    defaultValues: {
      sellingCategories: data.sellingCategories || [],
      productDescription: data.productDescription || '',
      pricingModel: data.pricingModel || [],
      supportEmail: data.supportEmail || '',
      productUrl: data.productUrl || '',
      currentlySellingOn: data.currentlySellingOn || [],
    },
  })
  const { watch } = form
  const sellingCategories = watch('sellingCategories')
  const pricingModel = watch('pricingModel')
  const productDescription = watch('productDescription')
  const supportEmail = watch('supportEmail')
  const productUrl = watch('productUrl')
  const currentlySellingOn = watch('currentlySellingOn')

  trackStepViewed('product')
  useEffect(() => {
    updateData({
      sellingCategories,
      pricingModel,
      productDescription,
      supportEmail,
      productUrl,
      currentlySellingOn,
    })
  }, [
    sellingCategories,
    pricingModel,
    productDescription,
    supportEmail,
    productUrl,
    currentlySellingOn,
    updateData,
  ])

  const blockedSelected = useMemo(
    () =>
      sellingCategories.filter((name) =>
        SELLING_CATEGORIES.some(
          (category) => category.name === name && category.prohibited,
        ),
      ),
    [sellingCategories],
  )

  const submitOrganization = async (
    formData: ProductDetailsFormSchema,
    verdict: AupVerdict | null,
  ) => {
    setApiLoading(true)
    if (!data.orgName || !data.orgSlug) {
      form.setError('root', {
        message: 'Business details are incomplete. Please start again.',
      })
      await showApiResponse(400, 'Failed to create organization')
      window.location.assign('/onboarding/business')
      return false
    }

    const switching = formData.currentlySellingOn.length > 0
    const switchingFrom = (
      switching ? formData.currentlySellingOn[0] : null
    ) as schemas['OrganizationDetails']['switching_from']
    const { data: organization, error } = await createOrganization.mutateAsync({
      name: data.orgName,
      slug: data.orgSlug,
      default_presentment_currency: (data.defaultCurrency ||
        'usd') as schemas['PresentmentCurrency'],
      country: (data.businessCountry || undefined) as
        | schemas['OrganizationCreate']['country']
        | undefined,
      default_tax_behavior: 'location',
      legal_entity:
        data.organizationType === 'company'
          ? {
              type: 'company',
              registered_name: data.registeredBusinessName ?? '',
            }
          : { type: 'individual' },
      ...(formData.supportEmail && { email: formData.supportEmail }),
      ...(formData.productUrl && { website: formData.productUrl }),
      details: {
        product_description: formData.productDescription,
        selling_categories: formData.sellingCategories,
        pricing_models: formData.pricingModel,
        switching,
        switching_from: switchingFrom,
      },
    })

    if (error) {
      const slugConflict =
        Array.isArray(error.detail) &&
        error.detail.some(
          (detail) => Array.isArray(detail.loc) && detail.loc.includes('slug'),
        )
      if (slugConflict) {
        await showApiResponse(
          409,
          'This slug is no longer available. Please pick another.',
        )
        window.location.assign('/onboarding/business')
        return false
      }
      form.setError('root', {
        message:
          typeof error.detail === 'string'
            ? error.detail
            : Array.isArray(error.detail)
              ? (error.detail[0]?.msg ?? 'Validation failed')
              : 'Something went wrong, please try again.',
      })
      await showApiResponse(400, 'Failed to create organization')
      return false
    }

    await router.invalidate()
    updateData({ organizationId: organization.id, orgSlug: organization.slug })
    trackStepCompleted('product', {
      organization_id: organization.id,
      ...(verdict && { aup_verdict: verdict }),
    })
    await showApiResponse(201, 'Created')
    window.location.assign('/onboarding/complete')
    return true
  }

  const onSubmit = async (formData: ProductDetailsFormSchema) => {
    const result = await aup.validate({
      product_description: formData.productDescription,
      selling_categories: formData.sellingCategories,
      pricing_models: formData.pricingModel,
    })
    if (!result.ok) {
      form.setError('root', {
        message: 'Something went wrong, please try again.',
      })
      return
    }
    if (result.verdict === 'DENY' || result.verdict === 'CLARIFY') return

    setLoading('submitting')
    if (!(await submitOrganization(formData, result.verdict))) setLoading(null)
  }

  const onContinueAnyway = async () => {
    setLoading('submitting-anyway')
    if (!(await submitOrganization(form.getValues(), aup.verdict))) {
      setLoading(null)
    }
  }

  const charCount = productDescription.length
  const counterColor = useMemo<'danger' | 'warning' | 'muted'>(() => {
    if (charCount > MAX_DESCRIPTION_LENGTH) return 'danger'
    if (charCount > 0 && charCount < MIN_DESCRIPTION_LENGTH) return 'warning'
    return 'muted'
  }, [charCount])

  return {
    form,
    aup,
    loading,
    sellingCategories,
    pricingModel,
    productDescription,
    currentlySellingOn,
    blockedSelected,
    charCount,
    counterColor,
    onSubmit,
    onContinueAnyway,
  }
}

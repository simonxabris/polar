import { ChipSelect } from '@/components/Form/ChipSelect'
import { PRICING_MODELS, SELLING_CATEGORIES } from '@/utils/productCategories'
import { Button, Text, TextArea } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@polar-sh/ui/components/ui/form'
import type { CSSProperties } from 'react'
import { AUPBlocker } from './AUPBlocker'
import { OnboardingShell } from './OnboardingShell'
import { ProductContactFields } from './ProductContactFields'
import {
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  useProductDetailsForm,
} from './useProductDetailsForm'

const SELLING_PLATFORMS = [
  ['paddle', 'Paddle'],
  ['lemon_squeezy', 'Lemon Squeezy'],
  ['gumroad', 'Gumroad'],
  ['stripe', 'Stripe'],
  ['other', 'Other'],
] as const

export function ProductDetailsStep() {
  const {
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
  } = useProductDetailsForm()

  return (
    <OnboardingShell
      title="Product Details"
      subtitle="Help us understand what you're building so we can tailor your experience."
    >
      <Form {...form}>
        <Box
          as="form"
          onSubmit={form.handleSubmit(onSubmit)}
          flexDirection="column"
          rowGap="xl"
        >
          <Box flexDirection="column" rowGap="m">
            <FormLabel>What are you selling?</FormLabel>
            <ChipSelect
              options={SELLING_CATEGORIES.map((category) => category.name)}
              selected={sellingCategories}
              onChange={(value) => form.setValue('sellingCategories', value)}
            />
          </Box>

          {blockedSelected.length > 0 ? (
            <AUPBlocker categories={blockedSelected} />
          ) : null}

          <FormField
            control={form.control}
            name="productDescription"
            rules={{ required: 'Please describe your product' }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Describe your product</FormLabel>
                <FormControl>
                  <TextArea
                    {...field}
                    resizable={false}
                    placeholder="Tell us about what you're selling..."
                    className="min-h-10 rounded-xl px-3 py-2.5"
                    style={{ fieldSizing: 'content' } as CSSProperties}
                  />
                </FormControl>
                <Box alignItems="center" justifyContent="between" columnGap="s">
                  <FormMessage />
                  <Text variant="caption" color={counterColor}>
                    {charCount}/{MAX_DESCRIPTION_LENGTH} (min{' '}
                    {MIN_DESCRIPTION_LENGTH})
                  </Text>
                </Box>
              </FormItem>
            )}
          />

          {aup.verdict ? (
            <Box
              flexDirection="column"
              rowGap="m"
              borderRadius="m"
              borderWidth={1}
              borderStyle="solid"
              borderColor="border-warning"
              backgroundColor="background-warning"
              padding="l"
            >
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {aup.verdict === 'CLARIFY'
                  ? 'Please clarify your use case'
                  : 'Use case not supported'}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {aup.message}
              </p>
            </Box>
          ) : null}

          <Box flexDirection="column" rowGap="m">
            <FormLabel>Pricing model</FormLabel>
            <ChipSelect
              options={PRICING_MODELS}
              selected={pricingModel}
              onChange={(value) => form.setValue('pricingModel', value)}
            />
          </Box>

          <Box flexDirection="column" rowGap="m">
            <FormLabel>
              Currently selling on{' '}
              <Box as="span" color="text-tertiary">
                (optional)
              </Box>
            </FormLabel>
            <ChipSelect
              options={SELLING_PLATFORMS}
              selected={currentlySellingOn}
              onChange={(value) => form.setValue('currentlySellingOn', value)}
            />
          </Box>

          <ProductContactFields control={form.control} />

          <Box flexDirection="column" rowGap="s">
            <Button
              type="submit"
              onClick={() => form.clearErrors()}
              loading={aup.isValidating || loading === 'submitting'}
              disabled={
                loading === 'submitting-anyway' ||
                blockedSelected.length > 0 ||
                sellingCategories.length === 0 ||
                pricingModel.length === 0 ||
                productDescription.trim().length < MIN_DESCRIPTION_LENGTH
              }
              fullWidth
            >
              {aup.verdict ? 'Review again' : 'Launch Dashboard'}
            </Button>

            {aup.verdict &&
            aup.history.length >= 2 &&
            productDescription.trim().length >= MIN_DESCRIPTION_LENGTH &&
            !aup.isValidating ? (
              <>
                <Button
                  variant="ghost"
                  type="button"
                  fullWidth
                  onClick={onContinueAnyway}
                  disabled={loading === 'submitting'}
                  loading={loading === 'submitting-anyway'}
                >
                  Continue anyway
                </Button>
                <Text variant="caption" color="muted" align="center">
                  You can continue setting up your account, but it may require
                  manual review before you can accept payments.
                </Text>
              </>
            ) : null}
            {form.formState.errors.root ? (
              <p className="text-sm text-red-500 dark:text-red-500">
                {form.formState.errors.root.message}
              </p>
            ) : null}
          </Box>
        </Box>
      </Form>
    </OnboardingShell>
  )
}

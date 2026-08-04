import { Input } from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@polar-sh/ui/components/ui/form'
import type { Control } from 'react-hook-form'
import type { ProductDetailsFormSchema } from './useProductDetailsForm'

export function ProductContactFields({
  control,
}: {
  control: Control<ProductDetailsFormSchema>
}) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: 'repeat(1, minmax(0, 1fr))',
        md: 'repeat(2, minmax(0, 1fr))',
      }}
      gap="m"
    >
      <FormField
        control={control}
        name="supportEmail"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>
              Support Email{' '}
              <Box as="span" color="text-tertiary">
                (optional)
              </Box>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="support@example.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="productUrl"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>
              Product URL{' '}
              <Box as="span" color="text-tertiary">
                (optional)
              </Box>
            </FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder="https://example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Box>
  )
}

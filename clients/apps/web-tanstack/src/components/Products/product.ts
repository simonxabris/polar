import type { schemas } from '@polar-sh/client'

export const isLegacyRecurringPrice = (
  price: schemas['ProductPrice'] | schemas['LegacyRecurringProductPrice'],
): price is schemas['LegacyRecurringProductPrice'] => 'legacy' in price

export const hasLegacyRecurringPrices = (
  product: schemas['CheckoutProduct'],
): product is schemas['Product'] & {
  prices: schemas['LegacyRecurringProductPrice'][]
} => product.prices.some(isLegacyRecurringPrice)

export const isMeteredPrice = (
  price: schemas['ProductPrice'] | schemas['LegacyRecurringProductPrice'],
): price is schemas['ProductPriceMeteredUnit'] =>
  price.amount_type === 'metered_unit'

export const isSeatBasedPrice = (
  price: schemas['ProductPrice'],
): price is schemas['ProductPriceSeatBased'] =>
  price.amount_type === 'seat_based'

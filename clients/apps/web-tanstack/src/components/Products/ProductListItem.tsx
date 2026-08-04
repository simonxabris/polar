import { ConfirmModal } from '@/components/Modal/ConfirmModal'
import { useModal } from '@/components/Modal/useModal'
import { toast } from '@/components/Toast/use-toast'
import { useUpdateProduct } from '@/hooks/useProducts'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import type { schemas } from '@polar-sh/client'
import { Button, ListItem, Pill, Status } from '@polar-sh/orbit'
import { Tooltip, TooltipContent, TooltipTrigger } from '@polar-sh/orbit'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@polar-sh/ui/components/ui/dropdown-menu'
import { useCallback, type MouseEvent } from 'react'
import LegacyRecurringProductPrices from './LegacyRecurringProductPrices'
import ProductPriceLabel from './ProductPriceLabel'
import {
  hasLegacyRecurringPrices,
  isMeteredPrice,
  isSeatBasedPrice,
} from './product'

interface ProductListItemProps {
  product: schemas['Product']
  organization: schemas['Organization']
  currency: string
}

export const ProductListItem = ({
  product,
  organization,
  currency,
}: ProductListItemProps) => {
  const { show, hide, isShown } = useModal()
  const updateProduct = useUpdateProduct(organization)
  const productPath = `/dashboard/${organization.slug}/products/${product.id}`

  const handleContextMenu =
    (callback: (event: MouseEvent) => void) => (event: MouseEvent) => {
      event.stopPropagation()
      callback(event)
    }

  const onArchiveProduct = useCallback(async () => {
    try {
      await updateProduct.mutate({
        id: product.id,
        body: { is_archived: true },
      })
      toast({
        title: 'Product archived',
        description: 'The product has been archived',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred while archiving the product',
      })
    }
  }, [product, updateProduct])

  const isUsageBasedProduct = product.prices.some(isMeteredPrice)
  const isSeatBasedProduct = product.prices.some(isSeatBasedPrice)

  return (
    <>
      <a href={productPath}>
        <ListItem className="flex flex-row items-center justify-between gap-x-6 pr-3">
          <div className="flex min-w-0 grow flex-row items-center gap-x-4 text-sm">
            <div className="flex min-w-0 flex-row items-center gap-x-2">
              <span className="truncate">{product.name}</span>
              {product.visibility === 'private' ? (
                <Pill color="gray" className="shrink-0 px-2 py-0.5 text-xs">
                  Private
                </Pill>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 flex-row items-center gap-x-4 md:gap-x-6">
            {product.is_archived ? (
              <Tooltip>
                <TooltipTrigger>
                  <Status color="red" status="Archived" />
                </TooltipTrigger>
                <TooltipContent align="center" side="left">
                  Archived products only prevents new subscribers & purchases
                </TooltipContent>
              </Tooltip>
            ) : (
              <>
                {isUsageBasedProduct ? (
                  <Pill
                    color="green"
                    className="hidden px-3 py-1 text-xs md:block"
                  >
                    Metered Pricing
                  </Pill>
                ) : null}
                {isSeatBasedProduct ? (
                  <Pill
                    color="blue"
                    className="hidden px-3 py-1 text-xs md:block"
                  >
                    Seat Pricing
                  </Pill>
                ) : null}
                <span className="text-sm leading-snug">
                  {hasLegacyRecurringPrices(product) ? (
                    <LegacyRecurringProductPrices product={product} />
                  ) : (
                    <ProductPriceLabel product={product} currency={currency} />
                  )}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="hidden md:inline-flex"
                  onClick={(event) => {
                    event.preventDefault()
                    window.location.assign(
                      `/dashboard/${organization.slug}/products/checkout-links?productId=${product.id}`,
                    )
                  }}
                >
                  Share
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <Button
                      className="border-none bg-transparent text-[16px] opacity-50 transition-opacity hover:opacity-100 dark:bg-transparent"
                      size="icon"
                      variant="secondary"
                    >
                      <MoreVertOutlined fontSize="inherit" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="dark:bg-polar-800 bg-gray-50 shadow-lg"
                  >
                    <DropdownMenuItem
                      onClick={handleContextMenu(() => {
                        if (typeof navigator !== 'undefined') {
                          void navigator.clipboard.writeText(product.id)
                        }
                      })}
                    >
                      Copy Product ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleContextMenu(() => {
                        window.location.assign(
                          `/dashboard/${organization.slug}/onboarding/integrate?productId=${product.id}`,
                        )
                      })}
                    >
                      Integrate Checkout
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleContextMenu(() => {
                        window.location.assign(`${productPath}/edit`)
                      })}
                    >
                      Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleContextMenu(() => {
                        window.location.assign(
                          `/dashboard/${organization.slug}/products/new?fromProductId=${product.id}`,
                        )
                      })}
                    >
                      Duplicate Product
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      destructive
                      onClick={handleContextMenu(show)}
                    >
                      Archive Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </ListItem>
      </a>
      <ConfirmModal
        isShown={isShown}
        hide={hide}
        title={`Archive "${product.name}"`}
        description="Are you sure you want to archive this product?"
        onConfirm={onArchiveProduct}
        destructive
        destructiveText="Yes, archive"
      />
    </>
  )
}

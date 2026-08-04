import { useProducts } from '@/hooks/useProducts'
import { productSortingSchema, productVisibilitySchema } from './productSearch'
import AddOutlined from '@mui/icons-material/AddOutlined'
import Search from '@mui/icons-material/Search'
import type { schemas } from '@polar-sh/client'
import {
  Button,
  Input,
  List,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@polar-sh/orbit'
import { Box } from '@polar-sh/orbit/Box'
import Paginator from '@polar-sh/ui/components/atoms/Paginator'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useCallback, useRef, useState } from 'react'
import { ProductListItem } from './ProductListItem'
import { ProductsEmptyState } from './ProductsEmptyState'

const routeApi = getRouteApi(
  '/_authenticated/dashboard/$organization/products/',
)

const createSearchParams = (page: number, limit: number, sorting: string) => {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  searchParams.append('sorting', sorting)
  return searchParams
}

export const ProductsPage = ({
  organization,
}: {
  organization: schemas['OrganizationWithRole']
}) => {
  const search = routeApi.useSearch()
  const page = search.page ?? 1
  const limit = search.limit ?? 20
  const sorting = search.sorting ?? 'name'
  const show = search.show ?? 'active'
  const navigate = useNavigate({
    from: '/dashboard/$organization/products/',
  })
  const [query, setQuery] = useState(search.query ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const replaceTableSearch = useCallback(
    (updates: {
      page?: number
      limit?: 20 | 50 | 100
      sorting?: typeof sorting
    }) => {
      void navigate({
        search: {
          page: updates.page ?? page,
          limit: updates.limit ?? limit,
          sorting: updates.sorting ?? sorting,
          query: query || undefined,
        },
        replace: true,
      })
    },
    [limit, navigate, page, query, sorting],
  )

  const onQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        void navigate({
          search: {
            page,
            limit,
            sorting,
            query: value || undefined,
          },
          replace: true,
        })
      }, 500)
    },
    [limit, navigate, page, sorting],
  )

  const products = useProducts(organization.id, {
    query: query || undefined,
    page,
    limit,
    sorting: [sorting],
    is_archived: show === 'all' ? null : show === 'active' ? false : true,
  })

  const sortedProducts = products.data?.items.slice().sort((a, b) => {
    if (a.is_archived === b.is_archived) return 0
    return a.is_archived ? 1 : -1
  })

  return (
    <Box
      minHeight="100%"
      width="100%"
      flexDirection="column"
      alignItems="center"
      paddingHorizontal={{ base: 'l', md: '2xl' }}
      paddingVertical="2xl"
      className="text-gray-900 dark:text-white"
    >
      <Box width="100%" maxWidth={1280} flexDirection="column" rowGap="2xl">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Catalogue
        </h1>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Input
                className="w-full md:max-w-64"
                preSlot={<Search fontSize="small" />}
                placeholder="Search Products"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
              />
              <Select
                value={show}
                onValueChange={(value) => {
                  const parsed = productVisibilitySchema.safeParse(value)
                  if (parsed.success) {
                    void navigate({
                      search: (previous) => ({
                        ...previous,
                        show:
                          parsed.data === 'active' ? undefined : parsed.data,
                      }),
                      replace: true,
                    })
                  }
                }}
              >
                <SelectTrigger className="w-full md:max-w-fit">
                  <SelectValue placeholder="Show archived products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sorting}
                onValueChange={(value) => {
                  const parsed = productSortingSchema.safeParse(value)
                  if (parsed.success) {
                    replaceTableSearch({ sorting: parsed.data, page: 1 })
                  }
                }}
              >
                <SelectTrigger className="w-full md:max-w-fit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="-name">Name Z-A</SelectItem>
                  <SelectItem value="-created_at">Newest</SelectItem>
                  <SelectItem value="created_at">Oldest</SelectItem>
                  <SelectItem value="price_amount">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="-price_amount">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
              {(products.data?.pagination.total_count ?? 0) > 20 ? (
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    const nextLimit = Number(value)
                    if (
                      nextLimit === 20 ||
                      nextLimit === 50 ||
                      nextLimit === 100
                    ) {
                      replaceTableSearch({ limit: nextLimit, page: 1 })
                    }
                  }}
                >
                  <SelectTrigger className="w-full md:max-w-fit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">Show 20</SelectItem>
                    <SelectItem value="50">Show 50</SelectItem>
                    <SelectItem value="100">Show 100</SelectItem>
                  </SelectContent>
                </Select>
              ) : null}
            </div>
            <a
              href={`/dashboard/${organization.slug}/products/new`}
              className="w-full md:w-fit"
            >
              <Button
                role="link"
                wrapperClassNames="gap-x-2 md:w-fit"
                className="w-full"
              >
                <AddOutlined className="h-4 w-4" />
                <span>New Product</span>
              </Button>
            </a>
          </div>
          {sortedProducts?.length ? (
            <div className="flex flex-col gap-y-12">
              <List size="small">
                {sortedProducts.map((product) => (
                  <ProductListItem
                    key={product.id}
                    organization={organization}
                    product={product}
                    currency={organization.default_presentment_currency}
                  />
                ))}
              </List>
              <Paginator
                currentPage={page}
                pageSize={limit}
                totalCount={products.data?.pagination.total_count ?? 0}
                currentURL={createSearchParams(page, limit, sorting)}
                onPageChange={(nextPage) =>
                  replaceTableSearch({ page: nextPage })
                }
              />
            </div>
          ) : (
            <ProductsEmptyState organizationSlug={organization.slug} />
          )}
        </div>
      </Box>
    </Box>
  )
}

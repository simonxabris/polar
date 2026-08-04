import { productSearchSchema } from '@/components/Products/productSearch'
import { ProductsPage } from '@/components/Products/ProductsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/$organization/products/',
)({
  validateSearch: productSearchSchema,
  head: ({ match }) => ({
    meta: [
      {
        title: `Products | ${match.context.organization.name} | Polar`,
      },
    ],
  }),
  component: ProductsRoute,
})

function ProductsRoute() {
  const { organization } = Route.useRouteContext()
  return <ProductsPage organization={organization} />
}

import HiveOutlined from '@mui/icons-material/HiveOutlined'
import { Button } from '@polar-sh/orbit'
import { ShadowBoxOnMd } from '@polar-sh/ui/components/atoms/ShadowBox'

export const ProductsEmptyState = ({
  organizationSlug,
}: {
  organizationSlug: string
}) => (
  <ShadowBoxOnMd className="items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
    <HiveOutlined
      className="dark:text-polar-600 text-5xl text-gray-300"
      fontSize="large"
    />
    <div className="flex flex-col items-center gap-y-6">
      <div className="flex flex-col items-center gap-y-2">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="dark:text-polar-500 text-gray-500">
          Start selling digital products today
        </p>
      </div>
      <a href={`/dashboard/${organizationSlug}/products/new`}>
        <Button role="link" variant="secondary">
          Create Product
        </Button>
      </a>
    </div>
  </ShadowBoxOnMd>
)

import { api } from '@/utils/client'
import {
  ClientResponseError,
  NotFoundResponseError,
  UnauthorizedResponseError,
  type operations,
  type schemas,
  unwrap,
} from '@polar-sh/client'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

const retry = (
  failureCount: number,
  error:
    | ClientResponseError
    | UnauthorizedResponseError
    | NotFoundResponseError,
) =>
  !(error instanceof UnauthorizedResponseError) &&
  !(error instanceof NotFoundResponseError) &&
  failureCount <= 2

export const useProducts = (
  organizationId: string,
  parameters: Omit<
    NonNullable<operations['products:list']['parameters']['query']>,
    'organization_id'
  >,
) =>
  useQuery({
    queryKey: ['products', { organizationId, ...parameters }],
    queryFn: () =>
      unwrap(
        api.GET('/v1/products/', {
          params: {
            query: {
              organization_id: organizationId,
              ...parameters,
            },
          },
        }),
      ),
    retry,
    placeholderData: keepPreviousData,
  })

export const useUpdateProduct = (organization: schemas['Organization']) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: schemas['ProductUpdate']
    }) =>
      unwrap(
        api.PATCH('/v1/products/{id}', {
          params: { path: { id } },
          body,
        }),
      ),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['products', { organizationId: organization.id }],
      })
      void queryClient.invalidateQueries({
        queryKey: ['products', { id: variables.id }],
      })
    },
  })
}

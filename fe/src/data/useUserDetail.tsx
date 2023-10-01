import { useQuery, UseQueryOptions } from 'react-query'
import { AxiosError } from 'axios'
import CallAPI from '@vscommerce/services/CallAPI'
import { UboxAPIResponse, User } from '@vscommerce/types/api'
import { useRouter } from 'next/router'

type IResponse = UboxAPIResponse<User>

function useUserDetail(params: {
  options?: UseQueryOptions<IResponse, AxiosError>
  id: string
}) {
  const { id, options } = params
  const router = useRouter()
  const queryKey = ['/user', id]

  const query = useQuery<IResponse, AxiosError>(
    queryKey,
    () =>
      CallAPI.getUserDetail(id).then((res) => {
        return res.data
      }),
    { enabled: !!id && router.isReady, ...options },
  )

  return {
    ...query,
    data: query.data?.data,
  }
}

export default useUserDetail

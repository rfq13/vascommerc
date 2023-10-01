import { useQuery, UseQueryOptions } from 'react-query'
import { AxiosError } from 'axios'
import CallAPI from '@vscommerce/services/CallAPI'
import { UboxAPIResponse, User } from '@vscommerce/types/api'
import { useRouter } from 'next/router'
import useAuthStore from '@vscommerce/store/auth'
import { useEffect } from 'react'

type IResponse = UboxAPIResponse<User>

type IParams = {
  options?: UseQueryOptions<IResponse, AxiosError>
}

function useGetCurrentUser(params: IParams) {
  const { setUser } = useAuthStore() as any
  const { options } = params
  const router = useRouter()
  const queryKey = ['/my-profile']

  const query = useQuery<IResponse, AxiosError>(
    queryKey,
    () =>
      CallAPI.getCurrentUser().then((res) => {
        return res.data
      }),
    { enabled: router.isReady, ...options },
  )

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data?.data)
    }
  }, [query.isSuccess])

  return {
    ...query,
    data: query.data?.data,
  }
}

export default useGetCurrentUser

import { useQuery, UseQueryOptions } from 'react-query'
import { AxiosError } from 'axios'
import CallAPI, { CommonQueryParams } from '@vscommerce/services/CallAPI'
import { useState } from 'react'
import { Permission, UboxAPIResponse } from '@vscommerce/types/api'

type IResponse = UboxAPIResponse<Permission[]>

type IParams = CommonQueryParams & {
  options?: UseQueryOptions<IResponse, AxiosError>
}

function usePermissions(params: IParams = {}) {
  const { page = 1, pageSize = 10, filtered, options } = params
  const [pagination, setPagination] = useState({ page, pageSize })
  const queryKey = ['/permission', pagination, filtered]

  const query = useQuery<IResponse, AxiosError>(
    queryKey,
    () =>
      CallAPI.getPermissions({ ...pagination, filtered }).then((res) => {
        return res.data
      }),
    { ...options },
  )

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
    pagination,
    /**
     * @param p page
     * @param ps pageSize
     */
    handlePaginationChange(p: number, ps: number) {
      setPagination((prev) => ({ ...prev, page: p, pageSize: ps }))
    },
  }
}

export default usePermissions

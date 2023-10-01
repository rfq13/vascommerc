import { useQuery, UseQueryOptions } from 'react-query'
import { AxiosError } from 'axios'
import CallAPI from '@vscommerce/services/CallAPI'
import { get } from 'lodash'
import useUrlQuery, {
  UseUrlQueryOptions,
} from '@vscommerce/helpers/QueryUrl/useUrlQuery'

function useReport(
  urlOptions?: UseUrlQueryOptions,
  options?: UseQueryOptions<any>,
) {
  const urlQuery = useUrlQuery(urlOptions)
  const query = useQuery<any, AxiosError>(
    urlQuery.transformKey('/get-report'),
    () => CallAPI.admin.get(urlQuery.transformUrl(`/report?`)),
    {
      refetchInterval: 1000 * 600 * 1, // 1 minute
      keepPreviousData: true,
      select: (res: any) => res?.data,
      ...options,
    },
  )

  const data = get(query, 'data.data', {})
  const total = get(query, 'data.total', 0) as number

  const page = urlQuery.getQueryById('page') || 1
  const pageSize = urlQuery.getQueryById('pageSize') || 10

  return {
    ...query,
    data,
    total,
    helper: urlQuery,
    pagination: {
      page,
      pageSize,
      total,
    },
    startNo: (page - 1) * pageSize + 1,
    handlePaginationChange(p: number, ps: number) {
      urlQuery.setQuery('page', p)
      urlQuery.setQuery('pageSize', ps)
    },
  }
}

export default useReport

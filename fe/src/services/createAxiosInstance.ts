import { notification } from 'antd'
import axios from 'axios'
import Router from 'next/router'

type IParams = {
  baseURL: string
  authTokenKey?: string
}

function createAxiosInstance(params: IParams) {
  const { baseURL, authTokenKey } = params
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
  })

  axiosInstance.interceptors.request.use(async (config: any) => {
    if (authTokenKey) {
      const originConfig = { ...config }
      const apiToken = localStorage.getItem(authTokenKey)

      /**
       * Only fill the token if it's available, to solve
       * issue where you can't manualy input the token
       */
      if (apiToken) {
        originConfig.headers.Authorization = `Bearer ${apiToken}`
      }
    }
    return config
  })

  axiosInstance.interceptors.response.use(
    (response) => {
      if (authTokenKey) {
        // Remove Token when logout
        if (
          response.config.url?.includes('/logout') &&
          response.status === 200
        ) {
          Router.push('/')
        }
      }
      return response
    },
    (error: any) => {
      notification.error({
        message:
          error?.response?.data?.message || error?.message || 'Unknown Error!',
      })

      if (error?.response?.status === 401) {
        localStorage.removeItem(authTokenKey)
        Router.push('/')
      }

      return Promise.reject(error)
    },
  )

  return axiosInstance
}

export default createAxiosInstance

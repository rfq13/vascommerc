import { AxiosInstance } from 'axios'
import { BASE_API_URL, AUTH_TOKEN_KEY } from '@vscommerce/constant'

import qs from 'query-string'
import {
  SignInResponse,
  UboxAPIResponse,
  User,
  Permission,
} from '@vscommerce/types/api'

import { omit } from 'lodash'
import createAxiosInstance from './createAxiosInstance'

export type CommonQueryParams = {
  page?: number
  pageSize?: number
  attributes?: string
  filtered?: {
    /**
     * It's like `get` lodash
     */
    id: string
    /**
     * The value that want to filter or search
     */
    value: any
    operator?: string
  }[]
}

class BaseCallAPI {
  /**
   * Call the API without token
   */
  public common: AxiosInstance

  /**
   * Required token to call the API
   */
  public admin: AxiosInstance

  constructor() {
    this.common = createAxiosInstance({
      baseURL: BASE_API_URL,
    })

    this.admin = createAxiosInstance({
      baseURL: BASE_API_URL,
      authTokenKey: AUTH_TOKEN_KEY,
    })
  }

  login(data: { email: string; password: string }) {
    return this.common.post<SignInResponse>(`/auth/admin/sign-in`, data)
  }

  forgotPassword(data: { email: string }) {
    return this.common.post<SignInResponse>(`/auth/forgot-password`, data)
  }

  verifyForgotPassword(data: { email: string; token: string }) {
    return this.common.post<SignInResponse>(
      `/auth/verify-forgot-password`,
      data,
    )
  }

  setNewPassword(data: {
    email: string
    token: string
    password: string
    confirmPassword: string
  }) {
    return this.common.post<SignInResponse>(`/auth/reset-password`, data)
  }

  getUsers(payload: CommonQueryParams) {
    return this.admin.get<UboxAPIResponse<User[]>>(
      `/user?${qs.stringify({
        ...payload,
        filtered: JSON.stringify(payload.filtered),
      })}`,
    )
  }

  getCurrentUser() {
    return this.admin.get<UboxAPIResponse<User>>(`/auth/my-profile`)
  }

  getUserDetail(id: string) {
    return this.admin.get<UboxAPIResponse<User>>(`/user/${id}`)
  }

  submitUser(data: {
    id: string
    email: string
    fullName: string
    phone: string
    password: string
    RoleId: string
  }) {
    if (data.id) {
      return this.admin.put(`/user/${data.id}`, {
        ...omit(data, ['id']),
        // Don't send to payload if user didn't input it
        ...(data.password ? { password: data.password } : {}),
      })
    }
    return this.admin.post(`/admin/create`, omit(data, 'id'))
  }

  deleteUser(id: string) {
    return this.admin.delete(`/user/soft-delete/${id}`)
  }

  getPermissions(payload: CommonQueryParams) {
    return this.admin.get<UboxAPIResponse<Permission[]>>(
      `/permission?${qs.stringify({
        ...payload,
        filtered: JSON.stringify(payload.filtered),
      })}`,
    )
  }

  assignPermission(data: { id: string; permissions: string[] }) {
    return this.admin.put(`/permission/${data.id}`, data)
  }

  submitProduct(data: FormData) {
    const id = data.get('id')
    data.delete('id')

    if (id) {
      return this.admin.put(`/product/${id}`, data)
    }
    return this.admin.post(`/product`, data)
  }

  getProducts(payload: CommonQueryParams) {
    return this.admin.get<UboxAPIResponse<User[]>>(
      `/product?${qs.stringify({
        ...payload,
        filtered: JSON.stringify(payload.filtered),
      })}`,
    )
  }
}

const CallAPI = new BaseCallAPI()

export default CallAPI

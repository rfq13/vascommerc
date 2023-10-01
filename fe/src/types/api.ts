export type UboxAPIResponse<T> = {
  data: T
  code: number
  message: string
  total: number
  dataValues?: Record<string, any>
}

export type SignInResponse = {
  code: number
  message: string
  data: {
    accessToken: string
    expiresIn: number
    tokenType: string
    user: {
      uid: string
    }
  }
}

export type Permission = {
  id: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  name: string
  path: string
  method: string
}

export interface RolePermission {
  permissionId: string
  roleId: string
  id: string
  Permission: Permission
}

export interface UserRole {
  RolePermissions: RolePermission[]
  id: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  name: string
}

export interface User {
  id: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  email: string
  phone: string
  fullName: string
  balance: any
  isActive: boolean
  isBlocked: boolean
  RoleId: string
  Role: UserRole
}

export interface Product {
  id: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  name: string
  price: string
  description: string
  image: string
}

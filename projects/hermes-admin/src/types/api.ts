export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  refreshToken: string
}

export interface UserListParams {
  username?: string
  status?: number
  page: number
  pageSize: number
}

export interface RoleListParams {
  name?: string
  status?: number
  page: number
  pageSize: number
}

export interface MenuListParams {
  name?: string
  status?: number
}

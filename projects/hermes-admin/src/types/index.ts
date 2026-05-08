export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: 0 | 1
  roles: string[]
  permissions: string[]
  createTime: string
}

export interface RoleInfo {
  id: number
  name: string
  code: string
  description: string
  status: 0 | 1
  createTime: string
}

export interface MenuItem {
  id: number
  parentId: number
  name: string
  path: string
  component: string
  icon: string
  sort: number
  type: 0 | 1 | 2  // 0: directory, 1: menu, 2: button
  status: 0 | 1
  permission: string
  children?: MenuItem[]
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
}

export interface SelectOption {
  label: string
  value: string | number
}

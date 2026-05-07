import type { UserInfo } from '@/types'
import type { UserListParams } from '@/types/api'
import type { PageResult } from '@/types'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

let mockUsers: UserInfo[] = [
  { id: 1, username: 'admin', nickname: '超级管理员', email: 'admin@hermes.com', phone: '13800138000', avatar: '', status: 1, roles: ['admin'], permissions: ['*'], createTime: '2024-01-01 00:00:00' },
  { id: 2, username: 'editor', nickname: '编辑员', email: 'editor@hermes.com', phone: '13800138001', avatar: '', status: 1, roles: ['editor'], permissions: ['dashboard'], createTime: '2024-01-02 00:00:00' },
  { id: 3, username: 'user1', nickname: '普通用户1', email: 'user1@hermes.com', phone: '13800138002', avatar: '', status: 1, roles: ['viewer'], permissions: [], createTime: '2024-01-03 00:00:00' },
  { id: 4, username: 'user2', nickname: '普通用户2', email: 'user2@hermes.com', phone: '13800138003', avatar: '', status: 0, roles: ['viewer'], permissions: [], createTime: '2024-01-04 00:00:00' },
  { id: 5, username: 'user3', nickname: '普通用户3', email: 'user3@hermes.com', phone: '13800138004', avatar: '', status: 1, roles: ['editor'], permissions: ['dashboard'], createTime: '2024-01-05 00:00:00' }
]
let nextId = 6

export async function getUserListApi(params: UserListParams): Promise<PageResult<UserInfo>> {
  await delay(300)
  let filtered = [...mockUsers]
  if (params.username) {
    filtered = filtered.filter(u => u.username.includes(params.username!))
  }
  if (params.status !== undefined && params.status !== null) {
    filtered = filtered.filter(u => u.status === params.status)
  }
  const start = (params.page - 1) * params.pageSize
  return { list: filtered.slice(start, start + params.pageSize), total: filtered.length }
}

export async function createUserApi(data: Omit<UserInfo, 'id' | 'createTime'>): Promise<UserInfo> {
  await delay(300)
  const newUser: UserInfo = { ...data, id: nextId++, createTime: new Date().toLocaleString() }
  mockUsers.push(newUser)
  return newUser
}

export async function updateUserApi(id: number, data: Partial<UserInfo>): Promise<UserInfo> {
  await delay(300)
  const idx = mockUsers.findIndex(u => u.id === id)
  if (idx === -1) throw new Error('用户不存在')
  mockUsers[idx] = { ...mockUsers[idx], ...data }
  return mockUsers[idx]
}

export async function deleteUserApi(id: number): Promise<void> {
  await delay(300)
  mockUsers = mockUsers.filter(u => u.id !== id)
}

import type { RoleInfo } from '@/types'
import type { RoleListParams } from '@/types/api'
import type { PageResult } from '@/types'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

let mockRoles: RoleInfo[] = [
  { id: 1, name: '超级管理员', code: 'admin', description: '拥有所有权限', status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 2, name: '编辑员', code: 'editor', description: '可编辑内容', status: 1, createTime: '2024-01-02 00:00:00' },
  { id: 3, name: '访客', code: 'viewer', description: '只读权限', status: 1, createTime: '2024-01-03 00:00:00' }
]
let nextId = 4

export async function getRoleListApi(params: RoleListParams): Promise<PageResult<RoleInfo>> {
  await delay(300)
  let filtered = [...mockRoles]
  if (params.name) {
    filtered = filtered.filter(r => r.name.includes(params.name!))
  }
  if (params.status !== undefined && params.status !== null) {
    filtered = filtered.filter(r => r.status === params.status)
  }
  const start = (params.page - 1) * params.pageSize
  return { list: filtered.slice(start, start + params.pageSize), total: filtered.length }
}

export async function createRoleApi(data: Omit<RoleInfo, 'id' | 'createTime'>): Promise<RoleInfo> {
  await delay(300)
  const newRole: RoleInfo = { ...data, id: nextId++, createTime: new Date().toLocaleString() }
  mockRoles.push(newRole)
  return newRole
}

export async function updateRoleApi(id: number, data: Partial<RoleInfo>): Promise<RoleInfo> {
  await delay(300)
  const idx = mockRoles.findIndex(r => r.id === id)
  if (idx === -1) throw new Error('角色不存在')
  mockRoles[idx] = { ...mockRoles[idx], ...data }
  return mockRoles[idx]
}

export async function deleteRoleApi(id: number): Promise<void> {
  await delay(300)
  mockRoles = mockRoles.filter(r => r.id !== id)
}

import type { MenuItem } from '@/types'
import type { MenuListParams } from '@/types/api'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

let mockMenus: MenuItem[] = [
  { id: 1, parentId: 0, name: '工作台', path: '/dashboard', component: 'dashboard/index', icon: 'Odometer', sort: 1, type: 1, status: 1, permission: 'dashboard' },
  { id: 2, parentId: 0, name: '系统管理', path: '/system', component: '', icon: 'Setting', sort: 2, type: 0, status: 1, permission: '' },
  { id: 3, parentId: 2, name: '用户管理', path: '/system/user', component: 'system/user/index', icon: 'User', sort: 1, type: 1, status: 1, permission: 'system:user:list' },
  { id: 4, parentId: 2, name: '角色管理', path: '/system/role', component: 'system/role/index', icon: 'UserFilled', sort: 2, type: 1, status: 1, permission: 'system:role:list' },
  { id: 5, parentId: 2, name: '菜单管理', path: '/system/menu', component: 'system/menu/index', icon: 'Menu', sort: 3, type: 1, status: 1, permission: 'system:menu:list' }
]
let nextId = 6

export async function getMenuListApi(params?: MenuListParams): Promise<MenuItem[]> {
  await delay(200)
  let filtered = [...mockMenus]
  if (params?.name) {
    filtered = filtered.filter(m => m.name.includes(params.name!))
  }
  if (params?.status !== undefined) {
    filtered = filtered.filter(m => m.status === params.status)
  }
  return filtered
}

export async function createMenuApi(data: Omit<MenuItem, 'id' | 'children'>): Promise<MenuItem> {
  await delay(300)
  const newMenu: MenuItem = { ...data, id: nextId++ }
  mockMenus.push(newMenu)
  return newMenu
}

export async function updateMenuApi(id: number, data: Partial<MenuItem>): Promise<MenuItem> {
  await delay(300)
  const idx = mockMenus.findIndex(m => m.id === id)
  if (idx === -1) throw new Error('菜单不存在')
  mockMenus[idx] = { ...mockMenus[idx], ...data }
  return mockMenus[idx]
}

export async function deleteMenuApi(id: number): Promise<void> {
  await delay(300)
  mockMenus = mockMenus.filter(m => m.id !== id && m.parentId !== id)
}

export function buildMenuTree(menus: MenuItem[]): MenuItem[] {
  const map = new Map<number, MenuItem>()
  menus.forEach(m => map.set(m.id, { ...m, children: [] }))
  const tree: MenuItem[] = []
  map.forEach(m => {
    if (m.parentId === 0) {
      tree.push(m)
    } else {
      const parent = map.get(m.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(m)
      }
    }
  })
  return tree.sort((a, b) => a.sort - b.sort)
}

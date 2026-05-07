import { setToken, setRefreshToken, removeToken } from '@/utils/auth'
import type { LoginParams, LoginResult } from '@/types/api'
import type { UserInfo } from '@/types'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// MOCK ONLY — plain-text passwords and hardcoded tokens are intentional for demo/development.
// Replace with real API calls and proper hashing before any production use.
const MOCK_USERS: Record<string, { password: string; userInfo: UserInfo; token: string }> = {
  admin: {
    password: '123456',
    token: 'mock-token-admin-xxxx',
    userInfo: {
      id: 1,
      username: 'admin',
      nickname: '超级管理员',
      email: 'admin@hermes.com',
      phone: '13800138000',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      status: 1,
      roles: ['admin'],
      permissions: ['*'],
      createTime: '2024-01-01 00:00:00'
    }
  },
  editor: {
    password: '123456',
    token: 'mock-token-editor-xxxx',
    userInfo: {
      id: 2,
      username: 'editor',
      nickname: '编辑员',
      email: 'editor@hermes.com',
      phone: '13800138001',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      status: 1,
      roles: ['editor'],
      permissions: ['dashboard'],
      createTime: '2024-01-02 00:00:00'
    }
  }
}

const TOKEN_USER_MAP: Record<string, string> = {
  'mock-token-admin-xxxx': 'admin',
  'mock-token-editor-xxxx': 'editor'
}

export async function loginApi(params: LoginParams): Promise<LoginResult> {
  await delay(300)
  const user = MOCK_USERS[params.username]
  if (!user || user.password !== params.password) {
    throw new Error('用户名或密码错误')
  }
  setToken(user.token)
  setRefreshToken(`refresh-${user.token}`)
  return { token: user.token, refreshToken: `refresh-${user.token}` }
}

export async function logoutApi(): Promise<void> {
  await delay(200)
  removeToken()
}

export async function getUserInfoApi(token: string): Promise<UserInfo> {
  await delay(200)
  const username = TOKEN_USER_MAP[token]
  if (!username) throw new Error('token 无效')
  return MOCK_USERS[username].userInfo
}

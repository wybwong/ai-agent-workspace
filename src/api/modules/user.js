import request from '../index'

// 替换为实际用户接口路径
export const getUserInfo = () => request.get('/user/info')

export const login = (data) => request.post('/auth/login', data)

export const logout = () => request.post('/auth/logout')

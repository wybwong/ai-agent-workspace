import request from '../index'

// 示例：用户列表接口模块
// 复制此文件，改 /demo → 你的业务路径，添加对应接口

export const demoApi = {
  // 列表（分页+搜索）
  list: (params) => request.get('/demo', { params }),

  // 详情
  detail: (id) => request.get(`/demo/${id}`),

  // 新增
  create: (data) => request.post('/demo', data),

  // 编辑
  update: (id, data) => request.put(`/demo/${id}`, data),

  // 删除
  remove: (id) => request.delete(`/demo/${id}`),
}

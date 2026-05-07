<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>⚡ Hermes Admin</h1>
        <p>专业后台管理系统</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleLogin">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.username" placeholder="admin / editor" size="large" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="form.password" type="password" placeholder="123456" size="large" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <div class="login-options">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          </div>
        </el-form-item>
        <el-button type="primary" size="large" style="width:100%" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form>
      <div class="login-tips">
        <p>管理员: admin / 123456</p>
        <p>编辑员: editor / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { loginApi } from '@/api/modules/auth'
import { usePermissionStore } from '@/stores/modules/permission'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const form = reactive({ username: 'admin', password: '123456' })

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }]
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await loginApi(form)
      ElMessage.success('登录成功')
      const permissionStore = usePermissionStore()
      permissionStore.resetRoutes()
      const redirect = (route.query.redirect as string) || '/dashboard'
      router.push(redirect)
    } catch (e: unknown) {
      const err = e as Error
      ElMessage.error(err.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);

  .login-card {
    width: 420px;
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);

    .login-header {
      text-align: center;
      margin-bottom: 32px;
      h1 {
        font-size: 24px;
        color: #409eff;
        margin-bottom: 8px;
      }
      p {
        color: #909399;
        font-size: 14px;
      }
    }

    .login-options {
      width: 100%;
    }

    .login-tips {
      margin-top: 20px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 6px;
      p {
        font-size: 12px;
        color: #909399;
        line-height: 1.8;
      }
    }
  }
}
</style>

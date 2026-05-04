import { ref } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 表单通用逻辑
 * @param {Object} initialValues - 表单初始值
 * @param {Function} submitFn   - 提交函数，接收表单数据，返回 Promise
 *
 * 用法：
 * const { formRef, formData, submitting, submit, reset } = useForm({ name: '', status: 1 }, demoApi.create)
 */
export function useForm(initialValues = {}, submitFn) {
  const formRef = ref(null)
  const formData = ref({ ...initialValues })
  const submitting = ref(false)

  async function submit(extraData = {}) {
    if (!formRef.value) return
    await formRef.value.validate()
    submitting.value = true
    try {
      await submitFn({ ...formData.value, ...extraData })
      ElMessage.success('操作成功')
      return true
    } finally {
      submitting.value = false
    }
  }

  function reset() {
    formRef.value?.resetFields()
    formData.value = { ...initialValues }
  }

  function setValues(values = {}) {
    formData.value = { ...initialValues, ...values }
  }

  return { formRef, formData, submitting, submit, reset, setValues }
}

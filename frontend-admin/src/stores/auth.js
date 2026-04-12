import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || null)
  const admin = ref(null)
  const loading = ref(false)

  const login = async (email, password) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      token.value = data.token
      admin.value = data.admin
      localStorage.setItem('admin_token', data.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    admin.value = null
    localStorage.removeItem('admin_token')
  }

  const verify = async () => {
    if (!token.value) return false
    try {
      const { data } = await api.post('/auth/verify')
      admin.value = data.admin
      return data.valid
    } catch {
      logout()
      return false
    }
  }

  return { token, admin, loading, login, logout, verify }
})

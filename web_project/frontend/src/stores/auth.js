import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', () => {
  // 状态 - 从 localStorage 初始化用户
  const userStr = localStorage.getItem('user')
  const user = ref(userStr ? JSON.parse(userStr) : null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.is_superuser === 1)

  // 操作方法
  async function signup(userData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData)
      
      // 注册后自动登录
      await login(userData.email, userData.password)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Signup failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      })
      
      token.value = response.data.access_token
      localStorage.setItem('token', token.value)
      
      // 获取用户资料
      await fetchProfile()
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      user.value = response.data
      // 将用户信息保存到 localStorage 供路由守卫使用
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      // 如果 token 无效，执行登出
      if (err.response?.status === 401) {
        logout()
      }
    }
  }

  async function updateProfile(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/me`, data, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      user.value = response.data
      // 更新 localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Update failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    // 状态
    user,
    token,
    loading,
    error,
    // 计算属性
    isAuthenticated,
    isAdmin,
    // 操作方法
    signup,
    login,
    logout,
    fetchProfile,
    updateProfile
  }
})


<template>
  <div class="min-h-screen flex items-center justify-center bg-datawhale-lightgray">
    <div class="bg-white p-10 rounded-lg shadow-lg w-full max-w-md border border-datawhale-gray">
      <!-- 登录和注册表单切换（带淡入淡出过渡效果） -->
      <Transition name="fade" mode="out-in">
        <!-- 登录表单（默认） -->
        <div v-if="!isSignup" key="signin">
          <h1 class="text-gray-800 text-3xl font-bold mb-6 text-center">Sign In</h1>
          
          <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="Email"
                required
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
              />
            </div>
            <div class="mb-6">
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="Password"
                required
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
              />
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-datawhale-blue text-white font-semibold py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>
          
          <p class="text-gray-500 text-center mt-6">
            New to FunRec?
            <button @click="toggleForm" class="text-datawhale-blue hover:underline ml-1">
              Sign up now
            </button>.
          </p>
        </div>

        <!-- 注册表单 -->
        <div v-else key="signup">
          <h1 class="text-gray-800 text-3xl font-bold mb-6 text-center">Sign Up</h1>
          
          <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>

          <form @submit.prevent="handleSignup">
            <!-- 邮箱 -->
            <div class="mb-4">
              <input
                v-model="signupForm.email"
                type="email"
                placeholder="Email"
                required
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
              />
            </div>

            <!-- 密码 -->
            <div class="mb-4">
              <input
                v-model="signupForm.password"
                type="password"
                placeholder="Password (min 6 characters)"
                required
                minlength="6"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
              />
            </div>

            <!-- 可选字段 -->
            <div class="mb-4">
              <label class="text-gray-500 text-sm block mb-2">Gender (Optional)</label>
              <div class="flex items-center space-x-6">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="signupForm.gender"
                    type="radio"
                    value="M"
                    class="w-4 h-4 text-datawhale-blue bg-datawhale-lightgray border-gray-300 focus:ring-datawhale-blue focus:ring-2"
                  />
                  <span class="text-gray-700">Male</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="signupForm.gender"
                    type="radio"
                    value="F"
                    class="w-4 h-4 text-datawhale-blue bg-datawhale-lightgray border-gray-300 focus:ring-datawhale-blue focus:ring-2"
                  />
                  <span class="text-gray-700">Female</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="signupForm.gender"
                    type="radio"
                    value=""
                    class="w-4 h-4 text-datawhale-blue bg-datawhale-lightgray border-gray-300 focus:ring-datawhale-blue focus:ring-2"
                  />
                  <span class="text-gray-700">Prefer not to say</span>
                </label>
              </div>
            </div>

            <div class="mb-4">
              <input
                v-model="signupForm.age"
                type="text"
                placeholder="Age (Optional)"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
              />
            </div>

            <!-- 偏好类型（用于冷启动推荐） -->
            <div class="mb-6">
              <label class="text-gray-500 text-sm block mb-2">
                Preferred Genres (helps us recommend movies for you)
              </label>
              <div class="flex flex-wrap gap-2 bg-datawhale-lightgray p-3 rounded border border-datawhale-gray max-h-40 overflow-y-auto">
                <button
                  v-for="genre in availableGenres"
                  :key="genre.id"
                  type="button"
                  @click="toggleGenre(genre.name)"
                  :class="[
                    'px-3 py-1 rounded-full text-sm transition-all duration-200',
                    signupForm.preferred_genres.includes(genre.name)
                      ? 'bg-datawhale-blue text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                  ]"
                >
                  {{ genre.name }}
                </button>
              </div>
              <p v-if="signupForm.preferred_genres.length > 0" class="text-gray-500 text-xs mt-2">
                Selected: {{ signupForm.preferred_genres.join(', ') }}
              </p>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-datawhale-blue text-white font-semibold py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Signing Up...' : 'Sign Up' }}
            </button>
          </form>
          
          <p class="text-gray-500 text-center mt-6">
            Already have an account?
            <button @click="toggleForm" class="text-datawhale-blue hover:underline ml-1">
              Sign In
            </button>.
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const router = useRouter()
const authStore = useAuthStore()

const isSignup = ref(false)
const loading = ref(false)
const error = ref('')
const availableGenres = ref([])

const loginForm = reactive({
  email: '',
  password: ''
})

const signupForm = reactive({
  email: '',
  password: '',
  gender: '',
  age: '',
  preferred_genres: []
})

// 组件挂载时获取可用的电影类型
onMounted(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/genres`)
    availableGenres.value = response.data.genres || []
  } catch (err) {
    console.error('Failed to fetch genres:', err)
  }
})

const toggleGenre = (genreName) => {
  const index = signupForm.preferred_genres.indexOf(genreName)
  if (index === -1) {
    signupForm.preferred_genres.push(genreName)
  } else {
    signupForm.preferred_genres.splice(index, 1)
  }
}

const toggleForm = () => {
  isSignup.value = !isSignup.value
  error.value = ''
  // 切换时清空表单
  loginForm.email = ''
  loginForm.password = ''
  signupForm.email = ''
  signupForm.password = ''
  signupForm.gender = ''
  signupForm.age = ''
  signupForm.preferred_genres = []
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const { success, error: authError } = await authStore.login(loginForm.email, loginForm.password)
  
  if (success) {
    router.push('/')
  } else {
    error.value = authError
  }
  
  loading.value = false
}

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  
  const { success, error: authError } = await authStore.signup(signupForm)
  
  if (success) {
    router.push('/')
  } else {
    error.value = authError
  }
  
  loading.value = false
}
</script>

<style scoped>
/* 淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


<template>
  <div class="min-h-screen bg-datawhale-lightgray pt-24 px-4 pb-12">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-gray-800 text-4xl font-bold mb-2">Account</h1>
        <p class="text-gray-500">Manage your profile information</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading || !authStore.user" class="bg-white rounded-lg p-8 shadow-lg border border-datawhale-gray">
        <div class="flex justify-center items-center py-12">
          <div class="text-gray-700 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-datawhale-blue mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>

      <!-- 个人资料卡片 -->
      <div v-else class="bg-white rounded-lg p-8 shadow-lg border border-datawhale-gray">
        <!-- 用户信息区域 -->
        <div class="mb-8 pb-8 border-b border-datawhale-gray">
          <h2 class="text-gray-800 text-2xl font-semibold mb-4">Profile Information</h2>
          
          <div v-if="!editing" class="space-y-3">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-datawhale-blue rounded-full flex items-center justify-center">
                <span class="text-white text-2xl font-bold">
                  {{ authStore.user?.email?.charAt(0).toUpperCase() || '?' }}
                </span>
              </div>
              <div>
                <p class="text-gray-800 text-xl font-semibold">{{ authStore.user?.email }}</p>
                <p class="text-gray-500 text-sm">Email / Username</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p class="text-gray-500 text-sm">Gender</p>
                <p class="text-gray-800">{{ authStore.user?.gender || 'Not specified' }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Age</p>
                <p class="text-gray-800">{{ authStore.user?.age || 'Not specified' }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Occupation</p>
                <p class="text-gray-800">{{ authStore.user?.occupation || 'Not specified' }}</p>
              </div>
            </div>

            <!-- 偏好类型（在个人资料信息中） -->
            <div class="mt-6">
              <p class="text-gray-500 text-sm mb-2">Preferred Genres</p>
              <div v-if="authStore.user?.preferred_genres?.length" class="flex flex-wrap gap-2">
                <span 
                  v-for="genre in authStore.user.preferred_genres" 
                  :key="genre"
                  class="bg-datawhale-blue/10 text-datawhale-blue px-3 py-1 rounded-full text-sm border border-datawhale-blue"
                >
                  {{ genre }}
                </span>
              </div>
              <p v-else class="text-gray-400 text-sm">Not specified</p>
            </div>

            <button
              @click="startEditing"
              class="mt-6 px-6 py-2 bg-datawhale-blue text-white font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>

          <!-- 编辑表单 -->
          <form v-else @submit.prevent="handleUpdate" class="space-y-4">
            <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>

            <div>
              <label class="text-gray-500 text-sm block mb-2">Email / Username</label>
              <input
                :value="authStore.user?.email"
                type="text"
                disabled
                class="w-full bg-datawhale-lightgray text-gray-400 px-4 py-2 rounded border border-datawhale-gray cursor-not-allowed"
              />
              <p class="text-gray-400 text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label class="text-gray-500 text-sm block mb-2">Gender</label>
              <div class="flex items-center space-x-6 bg-datawhale-lightgray px-4 py-2 rounded border border-datawhale-gray">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="editForm.gender"
                    type="radio"
                    value="M"
                    class="w-4 h-4 text-datawhale-blue border-gray-300 focus:ring-datawhale-blue focus:ring-2"
                  />
                  <span class="text-gray-700">Male</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="editForm.gender"
                    type="radio"
                    value="F"
                    class="w-4 h-4 text-datawhale-blue border-gray-300 focus:ring-datawhale-blue focus:ring-2"
                  />
                  <span class="text-gray-700">Female</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="editForm.gender"
                    type="radio"
                    value=""
                    class="w-4 h-4 text-datawhale-blue border-gray-300 focus:ring-datawhale-blue focus:ring-2"
                  />
                  <span class="text-gray-700">Not specified</span>
                </label>
              </div>
            </div>

            <div>
              <label class="text-gray-500 text-sm block mb-2">Age</label>
              <input
                v-model="editForm.age"
                type="text"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-2 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
              />
            </div>

            <div>
              <label class="text-gray-500 text-sm block mb-2">Occupation</label>
              <input
                v-model="editForm.occupation"
                type="text"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-2 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
              />
            </div>

            <!-- 偏好类型（可编辑） -->
            <div>
              <label class="text-gray-500 text-sm block mb-2">
                Preferred Genres (for personalized recommendations)
              </label>
              <div class="flex flex-wrap gap-2 bg-datawhale-lightgray p-3 rounded border border-datawhale-gray max-h-40 overflow-y-auto">
                <button
                  v-for="genre in availableGenres"
                  :key="genre.id"
                  type="button"
                  @click="toggleGenre(genre.name)"
                  :class="[
                    'px-3 py-1 rounded-full text-sm transition-all duration-200',
                    editForm.preferred_genres.includes(genre.name)
                      ? 'bg-datawhale-blue text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                  ]"
                >
                  {{ genre.name }}
                </button>
              </div>
              <p v-if="editForm.preferred_genres.length > 0" class="text-gray-500 text-xs mt-2">
                Selected: {{ editForm.preferred_genres.join(', ') }}
              </p>
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-datawhale-blue text-white font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelEditing"
                class="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- 常看类型（根据评分历史计算） -->
        <div class="mb-8 pb-8 border-b border-datawhale-gray">
          <h2 class="text-gray-800 text-2xl font-semibold mb-4">Frequent Genres</h2>
          <p class="text-gray-400 text-sm mb-3">Genres from movies you've rated (computed automatically)</p>
          <div v-if="authStore.user?.frequent_genres?.length" class="flex flex-wrap gap-2">
            <span 
              v-for="genre in authStore.user.frequent_genres" 
              :key="genre"
              class="bg-datawhale-lightgray text-gray-700 px-3 py-1 rounded-full text-sm border border-datawhale-gray"
            >
              {{ genre }}
            </span>
          </div>
          <p v-else class="text-gray-500">No rating data yet. Rate some movies!</p>
        </div>

        <!-- 最近评分 -->
        <div class="mb-8 pb-8 border-b border-datawhale-gray">
          <h2 class="text-gray-800 text-2xl font-semibold mb-4">Recent Ratings</h2>
          <div v-if="authStore.user?.recent_ratings?.length" class="space-y-4">
            <div 
              v-for="rating in authStore.user.recent_ratings" 
              :key="rating.movie_id"
              class="flex items-center justify-between bg-datawhale-lightgray p-4 rounded hover:bg-gray-200 transition-colors"
            >
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="text-gray-800 font-medium hover:text-datawhale-blue cursor-pointer" @click="router.push(`/movie/${rating.movie_id}`)">
                    {{ rating.title }}
                  </h3>
                  <div class="flex gap-1">
                    <span 
                      v-for="g in rating.genres?.slice(0, 2)" 
                      :key="g"
                      class="text-[10px] text-gray-500 border border-gray-300 px-1 rounded"
                    >
                      {{ g }}
                    </span>
                  </div>
                </div>
                <p class="text-gray-500 text-xs mt-1">
                  Rated on {{ new Date(rating.timestamp * 1000).toLocaleDateString() }}
                </p>
              </div>
              <div class="flex items-center">
                <span class="text-yellow-500 mr-1">★</span>
                <span class="text-gray-800 font-bold">{{ rating.rating }}</span>
                <span class="text-gray-500 text-sm ml-1">/ 10</span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No ratings yet.</p>
        </div>

        <!-- 退出登录区域 -->
        <div>
          <button
            @click="handleLogout"
            class="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const router = useRouter()
const authStore = useAuthStore()

const editing = ref(false)
const loading = ref(false)
const error = ref('')
const availableGenres = ref([])

const editForm = reactive({
  gender: '',
  age: '',
  occupation: '',
  preferred_genres: []
})

// 组件挂载时获取个人资料和可用的电影类型
onMounted(async () => {
  loading.value = true
  await authStore.fetchProfile()
  
  // 获取可编辑的电影类型列表
  try {
    const response = await axios.get(`${API_BASE_URL}/api/genres`)
    availableGenres.value = response.data.genres || []
  } catch (err) {
    console.error('Failed to fetch genres:', err)
  }
  
  loading.value = false
})

const startEditing = () => {
  if (!authStore.user) return
  
  editForm.gender = authStore.user?.gender || ''
  editForm.age = authStore.user?.age || ''
  editForm.occupation = authStore.user?.occupation || ''
  editForm.preferred_genres = [...(authStore.user?.preferred_genres || [])]
  editing.value = true
  error.value = ''
}

const cancelEditing = () => {
  editing.value = false
  error.value = ''
}

const toggleGenre = (genreName) => {
  const index = editForm.preferred_genres.indexOf(genreName)
  if (index === -1) {
    editForm.preferred_genres.push(genreName)
  } else {
    editForm.preferred_genres.splice(index, 1)
  }
}

const handleUpdate = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.updateProfile(editForm)

  if (result.success) {
    editing.value = false
  } else {
    error.value = result.error
  }

  loading.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/auth')
}
</script>


<template>
  <div class="flex flex-col space-y-2">
    <!-- 星级显示 -->
    <div class="flex items-center space-x-1">
      <button
        v-for="star in 10"
        :key="star"
        @click="handleRate(star)"
        @mouseenter="hoverRating = star"
        @mouseleave="hoverRating = 0"
        :disabled="!isAuthenticated || loading"
        class="transition-all duration-200 focus:outline-none disabled:cursor-not-allowed"
        :class="{ 'cursor-pointer hover:scale-110': isAuthenticated && !loading }"
      >
        <svg
          class="w-6 h-6 transition-colors"
          :class="getStarClass(star)"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
      
      <!-- 评分文本 -->
      <span v-if="userRating" class="text-gray-800 text-sm ml-2">
        {{ userRating }}/10
      </span>
    </div>

    <!-- 登录提示或加载状态 -->
    <div class="text-sm">
      <p v-if="!isAuthenticated" class="text-gray-500">
        <router-link to="/auth" class="text-datawhale-blue hover:underline">Sign in</router-link> to rate this movie
      </p>
      <p v-else-if="loading" class="text-gray-500">Saving...</p>
      <p v-else-if="userRating" class="text-gray-500">
        Your rating • 
        <button @click="handleRemove" class="text-datawhale-blue hover:underline ml-1">Remove</button>
      </p>
      <p v-else class="text-gray-500">Click to rate</p>
    </div>

    <!-- 错误信息 -->
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { ratingApi } from '../services/api'

const props = defineProps({
  movieId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['rated', 'removed'])

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const userRating = ref(0)
const hoverRating = ref(0)
const loading = ref(false)
const error = ref('')

// 获取用户已有的评分
onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchUserRating()
  }
})

const fetchUserRating = async () => {
  try {
    const response = await ratingApi.getUserRating(props.movieId)
    if (response.data.has_rated) {
      userRating.value = response.data.rating
    }
  } catch (err) {
    console.error('Failed to fetch rating:', err)
  }
}

const handleRate = async (rating) => {
  if (!isAuthenticated.value || loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await ratingApi.createRating(props.movieId, rating)
    userRating.value = rating
    emit('rated', rating)
  } catch (err) {
    console.error('Failed to rate:', err)
    error.value = 'Failed to save rating. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleRemove = async () => {
  if (!isAuthenticated.value || loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await ratingApi.deleteRating(props.movieId)
    userRating.value = 0
    emit('removed')
  } catch (err) {
    console.error('Failed to remove rating:', err)
    error.value = 'Failed to remove rating. Please try again.'
  } finally {
    loading.value = false
  }
}

const getStarClass = (star) => {
  const currentRating = hoverRating.value || userRating.value
  
  if (star <= currentRating) {
    return 'text-yellow-400'
  }
  return 'text-gray-600'
}
</script>


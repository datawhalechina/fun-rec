<template>
  <div class="movie-detail min-h-screen">
    <!-- 加载状态 -->
    <div v-if="loading" class="pt-24 px-8">
      <div class="skeleton h-96 w-full rounded-lg mb-8"></div>
      <div class="skeleton h-8 w-3/4 mb-4"></div>
      <div class="skeleton h-4 w-1/2 mb-8"></div>
    </div>

    <!-- 电影内容 -->
    <div v-else-if="movie" class="pt-20">
      <!-- 主横幅区域 -->
      <section class="relative h-[80vh] flex items-end">
      <!-- 背景 -->
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent">
        <div class="w-full h-full">
          <img
            :src="getPosterUrl(movie.movie_id)"
            :alt="movie.title"
            class="w-full h-full object-cover opacity-20"
            @error="onBackgroundError"
          />
        </div>
      </div>

        <!-- 电影信息 -->
        <div class="relative z-10 px-8 pb-16 w-full max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- 海报 -->
            <div class="flex-shrink-0 relative">
              <img
                v-if="!showPosterPlaceholder"
                :src="getPosterUrl(movie.movie_id)"
                :alt="movie.title"
                class="w-48 md:w-64 rounded-lg shadow-2xl"
                @error="onPosterError"
              />
              <div v-else class="w-48 md:w-64 h-72 md:h-96 bg-datawhale-lightgray rounded-lg flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            </div>

            <!-- 详情 -->
            <div class="flex-1">
              <h1 class="text-gray-800 text-4xl md:text-5xl font-bold mb-4">
                {{ movie.title }}
              </h1>

              <!-- 元数据 -->
              <div class="flex flex-wrap items-center gap-4 mb-6 text-lg">
                <span v-if="movie.year" class="text-gray-600">{{ movie.year }}</span>
                <span v-if="movie.runtime_minutes" class="text-gray-600">
                  {{ formatRuntime(movie.runtime_minutes) }}
                </span>
              <div v-if="movie.imdb_rating" class="flex items-center space-x-2">
                <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-gray-800 font-bold">{{ movie.imdb_rating.toFixed(1) }}/10</span>
                <span class="text-gray-500 text-sm">({{ movie.imdb_votes?.toLocaleString() }} votes)</span>
              </div>
              </div>

              <!-- 电影类型 -->
              <div v-if="movie.genres && movie.genres.length" class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="genre in movie.genres"
                  :key="genre"
                  class="px-4 py-2 bg-datawhale-blue/10 rounded-full text-datawhale-blue text-sm"
                >
                  {{ genre }}
                </span>
              </div>

              <!-- 描述 -->
              <p v-if="movie.description" class="text-gray-600 text-lg leading-relaxed mb-6 max-w-3xl">
                {{ movie.description }}
              </p>

              <!-- 星级评分（仅登录用户可见） -->
              <div v-if="authStore.isAuthenticated" class="mb-6">
                <h3 class="text-gray-800 text-lg font-semibold mb-2">Rate This Movie</h3>
                <StarRating 
                  :movie-id="movie.movie_id" 
                  @rated="handleRated" 
                  @removed="handleRemoved"
                />
              </div>

              <!-- 操作按钮 -->
              <div class="flex space-x-4">
                <button
                  @click="goBack"
                  class="px-8 py-3 bg-datawhale-blue hover:bg-blue-700 text-white font-semibold rounded transition-colors flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 附加信息区域 -->
      <section class="px-8 py-12 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- 演员阵容 -->
          <div v-if="cast && cast.length" class="lg:col-span-2">
            <h2 class="text-gray-800 text-2xl font-bold mb-6">Cast</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div
                v-for="member in cast.slice(0, 6)"
                :key="member.person_id"
                class="bg-datawhale-lightgray rounded-lg p-4 border border-datawhale-gray"
              >
                <div class="text-gray-800 font-semibold mb-1">{{ member.name }}</div>
                <div class="text-gray-500 text-sm">{{ member.character || member.category }}</div>
              </div>
            </div>
          </div>

          <!-- 主创人员与信息 -->
          <div class="space-y-8">
            <!-- 导演 -->
            <div v-if="crew && crew.directors && crew.directors.length">
              <h3 class="text-gray-800 text-lg font-semibold mb-3">Directors</h3>
              <div class="space-y-2">
                <div
                  v-for="director in crew.directors"
                  :key="director.person_id"
                  class="text-gray-600"
                >
                  {{ director.name }}
                </div>
              </div>
            </div>

            <!-- 编剧 -->
            <div v-if="crew && crew.writers && crew.writers.length">
              <h3 class="text-gray-800 text-lg font-semibold mb-3">Writers</h3>
              <div class="space-y-2">
                <div
                  v-for="writer in crew.writers.slice(0, 3)"
                  :key="writer.person_id"
                  class="text-gray-600"
                >
                  {{ writer.name }}
                </div>
              </div>
            </div>

            <!-- 附加信息 -->
            <div>
              <h3 class="text-gray-800 text-lg font-semibold mb-3">Movie Info</h3>
              <div class="space-y-2 text-gray-600">
                <div v-if="movie.title_type">
                  <span class="text-gray-500">Type:</span> {{ movie.title_type }}
                </div>
                <div v-if="movie.imdb_id">
                  <span class="text-gray-500">IMDb:</span>
                  <a
                    :href="`https://www.imdb.com/title/${movie.imdb_id}/`"
                    target="_blank"
                    class="text-datawhale-blue hover:underline ml-1"
                  >
                    {{ movie.imdb_id }}
                  </a>
                </div>
                <div v-if="movie.avg_rating">
                  <span class="text-gray-500">User Rating:</span> {{ movie.avg_rating.toFixed(1) }} / 10.0
                </div>
                <div v-if="movie.rating_count">
                  <span class="text-gray-500">Ratings:</span> {{ movie.rating_count.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 错误状态 -->
    <div v-else class="pt-24 px-8 text-center">
      <h2 class="text-gray-800 text-2xl mb-4">Movie not found</h2>
      <button
        @click="goBack"
        class="px-6 py-2 bg-datawhale-blue text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { movieApi, getPosterUrl } from '../services/api'
import { useAuthStore } from '../stores/auth'
import StarRating from '../components/StarRating.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const movie = ref(null)
const cast = ref([])
const crew = ref(null)
const loading = ref(true)
const showPosterPlaceholder = ref(false)

const onPosterError = () => {
  showPosterPlaceholder.value = true
}

const onBackgroundError = (e) => {
  e.target.style.opacity = '0'
}

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const handleRated = (rating) => {
  console.log(`Movie rated: ${rating}/5`)
  // 可选：刷新电影数据以显示更新后的平均评分
  fetchMovieDetails()
}

const handleRemoved = () => {
  console.log('Rating removed')
  // 可选：刷新电影数据
  fetchMovieDetails()
}

const fetchMovieDetails = async () => {
  const movieId = route.params.id

  try {
    // 获取电影详情
    const movieResponse = await movieApi.getMovie(movieId)
    movie.value = movieResponse.data

    // 获取演员阵容（可选，部分电影可能没有）
    try {
      const castResponse = await movieApi.getMovieCast(movieId)
      cast.value = castResponse.data.cast
    } catch (error) {
      console.log('No cast data available')
    }

    // 获取主创人员（可选，部分电影可能没有）
    try {
      const crewResponse = await movieApi.getMovieCrew(movieId)
      crew.value = crewResponse.data
    } catch (error) {
      console.log('No crew data available')
    }

    loading.value = false
  } catch (error) {
    console.error('Failed to fetch movie:', error)
    loading.value = false
  }
}

onMounted(fetchMovieDetails)
</script>


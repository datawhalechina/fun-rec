<template>
  <div class="home min-h-screen">
    <!-- 主横幅 -->
    <section class="hero relative h-[70vh] flex items-center">
      <!-- 背景 -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white">
        <div v-if="featuredMovie" class="w-full h-full">
          <img
            :src="getPosterUrl(featuredMovie.movie_id)"
            :alt="featuredMovie.title"
            class="w-full h-full object-cover opacity-30"
            @error="onHeroImageError"
          />
        </div>
      </div>

      <!-- 主横幅内容 -->
      <div class="relative z-10 px-8 max-w-2xl">
        <h1 class="text-gray-800 text-5xl md:text-6xl font-bold mb-4">
          {{ featuredMovie?.title || 'FunRec Movies' }}
        </h1>
        <p v-if="featuredMovie?.description" class="text-gray-600 text-lg md:text-xl mb-6 line-clamp-3">
          {{ featuredMovie.description }}
        </p>
        <div v-if="featuredMovie" class="flex items-center space-x-4 mb-6">
          <div v-if="featuredMovie.imdb_rating" class="flex items-center space-x-2">
            <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-gray-800 text-xl font-bold">{{ featuredMovie.imdb_rating.toFixed(1) }}</span>
          </div>
          <span v-if="featuredMovie.year" class="text-gray-500 text-lg">{{ featuredMovie.year }}</span>
          <div v-if="featuredMovie.genres" class="flex space-x-2">
            <span
              v-for="genre in featuredMovie.genres.slice(0, 3)"
              :key="genre"
              class="text-gray-700 text-sm px-3 py-1 bg-datawhale-blue/10 rounded"
            >
              {{ genre }}
            </span>
          </div>
        </div>
        <div class="flex space-x-4">
          <router-link
            v-if="featuredMovie"
            :to="`/movie/${featuredMovie.movie_id}`"
            class="px-8 py-3 bg-datawhale-blue text-white font-semibold rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>More Info</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 电影行列表 -->
    <section class="movie-rows relative z-20 -mt-32">
      <!-- 为你推荐（个性化推荐） -->
      <MovieRow
        v-if="authStore.isAuthenticated"
        title="For You"
        :movies="forYouMovies"
        :loading="loadingForYou"
        :card-width="200"
      />

      <!-- 热门电影 -->
      <MovieRow
        title="Popular on FunRec"
        :movies="popularMovies"
        :loading="loadingPopular"
        :card-width="200"
      />

      <!-- 高分电影 -->
      <!-- <MovieRow
        title="Top Rated"
        :movies="topRatedMovies"
        :loading="loadingTopRated"
        :card-width="200"
      /> -->

      <!-- 动作电影 -->
      <MovieRow
        title="Action Movies"
        :movies="actionMovies"
        :loading="loadingAction"
        :card-width="200"
      />

      <!-- 喜剧电影 -->
      <MovieRow
        title="Comedy Movies"
        :movies="comedyMovies"
        :loading="loadingComedy"
        :card-width="200"
      />

      <!-- 剧情电影 -->
      <MovieRow
        title="Drama Movies"
        :movies="dramaMovies"
        :loading="loadingDrama"
        :card-width="200"
      />

      <!-- 科幻电影 -->
      <MovieRow
        title="Sci-Fi Movies"
        :movies="scifiMovies"
        :loading="loadingScifi"
        :card-width="200"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import MovieRow from '../components/MovieRow.vue'
import { movieApi, getPosterUrl } from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const popularMovies = ref([])
const forYouMovies = ref([])
const topRatedMovies = ref([])
const actionMovies = ref([])
const comedyMovies = ref([])
const dramaMovies = ref([])
const scifiMovies = ref([])

const loadingPopular = ref(true)
const loadingForYou = ref(false)
const loadingTopRated = ref(true)
const loadingAction = ref(true)
const loadingComedy = ref(true)
const loadingDrama = ref(true)
const loadingScifi = ref(true)

// 主横幅特色电影：优先使用"为你推荐"行，回退到"FunRec 热门"
const featuredMovie = computed(() => {
  // 首选：来自"为你推荐"的首部电影（个性化推荐）
  if (forYouMovies.value && forYouMovies.value.length > 0) {
    return forYouMovies.value[0]
  }
  // 回退：来自"FunRec 热门"的首部电影
  if (popularMovies.value && popularMovies.value.length > 0) {
    return popularMovies.value[0]
  }
  return null
})

const onHeroImageError = (e) => {
  e.target.style.opacity = '0'
}

const fetchRecommendations = async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    forYouMovies.value = []
    return
  }
  
  loadingForYou.value = true
  try {
    const response = await movieApi.getRecommendations(authStore.user.user_id)
    forYouMovies.value = response.data
  } catch (error) {
    console.error('Failed to fetch recommendations:', error)
  } finally {
    loadingForYou.value = false
  }
}

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    fetchRecommendations()
  } else {
    forYouMovies.value = []
  }
})

onMounted(async () => {
  if (authStore.isAuthenticated) {
    fetchRecommendations()
  }

  // 获取轮播图的热门电影（主横幅使用计算属性）
  try {
    const response = await movieApi.getPopularMovies(30)
    popularMovies.value = response.data
    loadingPopular.value = false
  } catch (error) {
    console.error('Failed to fetch popular movies:', error)
    loadingPopular.value = false
  }

  // 获取高分电影
  try {
    const response = await movieApi.getMovies({
      sort_by: 'rating',
      min_rating: 7.0,
      page_size: 20,
    })
    topRatedMovies.value = response.data.items
    loadingTopRated.value = false
  } catch (error) {
    console.error('Failed to fetch top rated movies:', error)
    loadingTopRated.value = false
  }

  // 获取动作电影
  try {
    const response = await movieApi.getMovies({
      genre: 'Action',
      sort_by: 'rating',
      page_size: 20,
    })
    actionMovies.value = response.data.items
    loadingAction.value = false
  } catch (error) {
    console.error('Failed to fetch action movies:', error)
    loadingAction.value = false
  }

  // 获取喜剧电影
  try {
    const response = await movieApi.getMovies({
      genre: 'Comedy',
      sort_by: 'rating',
      page_size: 20,
    })
    comedyMovies.value = response.data.items
    loadingComedy.value = false
  } catch (error) {
    console.error('Failed to fetch comedy movies:', error)
    loadingComedy.value = false
  }

  // 获取剧情电影
  try {
    const response = await movieApi.getMovies({
      genre: 'Drama',
      sort_by: 'rating',
      page_size: 20,
    })
    dramaMovies.value = response.data.items
    loadingDrama.value = false
  } catch (error) {
    console.error('Failed to fetch drama movies:', error)
    loadingDrama.value = false
  }

  // 获取科幻电影
  try {
    const response = await movieApi.getMovies({
      genre: 'Sci-Fi',
      sort_by: 'rating',
      page_size: 20,
    })
    scifiMovies.value = response.data.items
    loadingScifi.value = false
  } catch (error) {
    console.error('Failed to fetch sci-fi movies:', error)
    loadingScifi.value = false
  }
})
</script>

<style scoped>
.hero {
  margin-top: -72px; /* Offset header height */
  padding-top: 72px;
}
</style>


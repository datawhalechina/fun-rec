<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      @click="closeSearch"
    >
      <!-- 搜索容器 -->
      <div class="w-full" @click.stop>
        <!-- 搜索栏 -->
        <div class="w-full bg-white border-b border-gray-200 shadow-sm">
          <div class="max-w-4xl mx-auto px-8 py-6">
            <div class="relative">
              <!-- 搜索图标 -->
              <svg
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <!-- 搜索输入框 -->
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search movies by title, genre, or description..."
                class="w-full pl-12 pr-20 py-4 bg-datawhale-lightgray text-gray-800 text-lg rounded-lg border-2 border-gray-200 focus:border-datawhale-blue focus:outline-none transition-colors placeholder-gray-400"
                @keydown.esc="closeSearch"
              />

              <!-- 清除按钮 -->
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <!-- 关闭按钮 -->
              <button
                @click="closeSearch"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Close (ESC)"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- 搜索统计 -->
            <div v-if="searchQuery && !isSearching" class="mt-3 text-sm text-gray-500">
              <span v-if="searchResults.length > 0">
                Found {{ searchResults.length }} movie{{ searchResults.length !== 1 ? 's' : '' }}
              </span>
              <span v-else-if="hasSearched">No results found</span>
            </div>
          </div>
        </div>

        <!-- 结果容器 -->
        <div class="max-w-7xl mx-auto px-8 py-8 overflow-y-auto bg-white" style="max-height: calc(100vh - 180px)">
          <!-- 加载状态 -->
          <div v-if="isSearching" class="flex justify-center items-center py-20">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-datawhale-blue"></div>
              <span class="text-gray-500 text-lg">Searching...</span>
            </div>
          </div>

          <!-- 空状态 - 无查询 -->
          <div v-else-if="!searchQuery" class="text-center py-20">
            <svg
              class="mx-auto w-20 h-20 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 class="text-2xl font-semibold text-gray-500 mb-2">Start typing to search</h3>
            <p class="text-gray-400">Find movies by title, genre, or description</p>
          </div>

          <!-- 空状态 - 无结果 -->
          <div v-else-if="searchResults.length === 0 && hasSearched" class="text-center py-20">
            <svg
              class="mx-auto w-20 h-20 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="text-2xl font-semibold text-gray-500 mb-2">No results found</h3>
            <p class="text-gray-400">Try different keywords or check your spelling</p>
          </div>

          <!-- 结果网格 -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <router-link
              v-for="movie in searchResults"
              :key="movie.movie_id"
              :to="`/movie/${movie.movie_id}`"
              @click="closeSearch"
              class="group cursor-pointer"
            >
              <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-datawhale-lightgray border-2 border-transparent group-hover:border-datawhale-blue transition-all duration-300 transform group-hover:scale-105 shadow-md">
                <!-- 电影海报 -->
                <img
                  :src="getPosterUrl(movie.movie_id)"
                  :alt="movie.title"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />

                <!-- 悬停时的遮罩层 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 left-0 right-0 p-3">
                    <h4 class="text-white font-semibold text-sm line-clamp-2 mb-1">
                      {{ movie.title }}
                    </h4>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-300">{{ movie.year }}</span>
                      <div v-if="movie.imdb_rating" class="flex items-center space-x-1">
                        <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="text-yellow-400 font-semibold">{{ movie.imdb_rating.toFixed(1) }}</span>
                      </div>
                    </div>
                    <!-- 电影类型 -->
                    <div v-if="movie.genres && movie.genres.length > 0" class="mt-1 flex flex-wrap gap-1">
                      <span
                        v-for="genre in movie.genres.slice(0, 2)"
                        :key="genre"
                        class="px-1.5 py-0.5 bg-datawhale-blue/80 text-white text-xs rounded"
                      >
                        {{ genre }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { searchApi, getPosterUrl } from '../services/api'

// 组件属性
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// 事件触发
const emit = defineEmits(['close'])

// 状态
const searchInput = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const hasSearched = ref(false)
let searchTimeout = null

// 监听弹窗打开以聚焦输入框
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    // 关闭时重置
    searchQuery.value = ''
    searchResults.value = []
    hasSearched.value = false
  }
})

// 监听搜索查询并进行防抖处理
watch(searchQuery, (newQuery) => {
  // 清除之前的定时器
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // 如果查询为空，重置状态
  if (!newQuery.trim()) {
    searchResults.value = []
    hasSearched.value = false
    isSearching.value = false  // 重置搜索状态
    return
  }

  // 设置搜索状态
  isSearching.value = true

  // 防抖延迟 300ms 后执行搜索
  searchTimeout = setTimeout(async () => {
    try {
      const results = await searchApi.searchMovies(newQuery.trim())
      searchResults.value = results
      hasSearched.value = true
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
      hasSearched.value = true
    } finally {
      isSearching.value = false
    }
  }, 300)
})

// 方法
const closeSearch = () => {
  emit('close')
}

const clearSearch = () => {
  searchQuery.value = ''
  searchInput.value?.focus()
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect width="200" height="300" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23666"%3ENo Poster%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
/* 遮罩层的淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 结果区域的自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>


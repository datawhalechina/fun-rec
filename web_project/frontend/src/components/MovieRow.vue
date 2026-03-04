<template>
  <div class="movie-row mb-10">
    <!-- 行标题 -->
    <h2 class="text-gray-800 text-xl md:text-2xl font-bold mb-4 px-8">
      {{ title }}
    </h2>

    <!-- 电影容器 -->
    <div class="relative group">
      <!-- 电影滚动容器 -->
      <div
        ref="scrollContainer"
        class="movie-row-container flex space-x-2 overflow-x-auto px-8 pb-4 scroll-smooth"
        style="scrollbar-width: thin;"
      >
        <!-- 加载骨架屏 -->
        <template v-if="loading">
          <div
            v-for="i in 10"
            :key="i"
            class="flex-shrink-0 skeleton rounded-md"
            :style="{ width: `${cardWidth}px`, height: `${cardWidth * 1.5}px` }"
          />
        </template>

        <!-- 电影卡片 -->
        <template v-else-if="movies.length">
          <MovieCard
            v-for="movie in movies"
            :key="movie.movie_id"
            :movie="movie"
            :width="cardWidth"
          />
        </template>

        <!-- 空状态 -->
        <div v-else class="text-gray-500 py-8">
          No movies found
        </div>
      </div>

      <!-- 滚动按钮（桌面端） -->
      <template v-if="!loading && movies.length > 5">
        <button
          v-if="showLeftArrow"
          @click="scrollLeft"
          class="hidden md:flex absolute left-0 top-0 bottom-4 w-12 items-center justify-center bg-datawhale-blue/80 hover:bg-datawhale-blue transition-colors z-10 opacity-0 group-hover:opacity-100"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          v-if="showRightArrow"
          @click="scrollRight"
          class="hidden md:flex absolute right-0 top-0 bottom-4 w-12 items-center justify-center bg-datawhale-blue/80 hover:bg-datawhale-blue transition-colors z-10 opacity-0 group-hover:opacity-100"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  cardWidth: {
    type: Number,
    default: 180,
  },
})

const scrollContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(true)

const updateArrows = () => {
  if (!scrollContainer.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  showLeftArrow.value = scrollLeft > 0
  showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 10
}

const scrollLeft = () => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth - 100
  scrollContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}

const scrollRight = () => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth - 100
  scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateArrows)
    updateArrows()
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', updateArrows)
  }
})
</script>


<template>
  <router-link
    :to="`/movie/${movie.movie_id}`"
    class="movie-card relative flex-shrink-0 cursor-pointer group"
    :style="{ width: `${width}px` }"
  >
    <!-- 电影海报 -->
    <div class="relative aspect-[2/3] rounded-md overflow-hidden bg-datawhale-lightgray shadow-md">
      <img
        :src="getPosterUrl(movie.movie_id)"
        :alt="movie.title"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="onImageError"
      />
      <div v-if="showPlaceholder" class="absolute inset-0 w-full h-full flex items-center justify-center bg-datawhale-lightgray">
        <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      </div>

      <!-- 悬停遮罩层 -->
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 class="text-white text-sm font-semibold line-clamp-2 mb-1">
          {{ movie.title }}
        </h3>
        <div class="flex items-center justify-between text-xs">
          <span v-if="movie.year" class="text-gray-300">{{ movie.year }}</span>
          <div v-if="movie.imdb_rating" class="flex items-center space-x-1">
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-white font-medium">{{ movie.imdb_rating.toFixed(1) }}</span>
          </div>
        </div>
        <div v-if="movie.genres && movie.genres.length" class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="genre in movie.genres.slice(0, 2)"
            :key="genre"
            class="text-xs px-2 py-0.5 bg-white/20 rounded-full text-white"
          >
            {{ genre }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { getPosterUrl } from '../services/api'

defineProps({
  movie: {
    type: Object,
    required: true,
  },
  width: {
    type: Number,
    default: 180,
  },
})

const showPlaceholder = ref(false)

const onImageError = (e) => {
  showPlaceholder.value = true
}
</script>


<template>
  <div class="min-h-screen bg-datawhale-lightgray text-gray-800 p-8 pt-24">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">Add New Movie</h1>
            <p class="text-gray-500">Fill in the movie details below</p>
          </div>
          <router-link
            to="/"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </router-link>
        </div>
      </div>

      <!-- 错误提示横幅 -->
      <div v-if="error" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- 基本信息 -->
        <div class="bg-white p-6 rounded-lg border border-datawhale-gray shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <!-- 标题 -->
            <div>
              <label class="block text-gray-600 text-sm font-medium mb-2">
                Title <span class="text-datawhale-blue">*</span>
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                maxlength="255"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
                placeholder="Enter movie title"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- 年份 -->
              <div>
                <label class="block text-gray-600 text-sm font-medium mb-2">
                  Year
                </label>
                <input
                  v-model.number="formData.year"
                  type="number"
                  min="1888"
                  max="2099"
                  class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
                  placeholder="e.g., 1999"
                />
              </div>

              <!-- 时长 -->
              <div>
                <label class="block text-gray-600 text-sm font-medium mb-2">
                  Runtime (minutes)
                </label>
                <input
                  v-model.number="formData.runtime_minutes"
                  type="number"
                  min="1"
                  class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
                  placeholder="e.g., 120"
                />
              </div>

              <!-- 类型 -->
              <div>
                <label class="block text-gray-600 text-sm font-medium mb-2">
                  Type
                </label>
                <select
                  v-model="formData.title_type"
                  class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
                >
                  <option value="">Select type</option>
                  <option value="movie">Movie</option>
                  <option value="tvSeries">TV Series</option>
                  <option value="tvMovie">TV Movie</option>
                  <option value="short">Short</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- IMDb 集成 -->
        <div class="bg-white p-6 rounded-lg border border-datawhale-gray shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">IMDb Integration</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- IMDb ID -->
            <div>
              <label class="block text-gray-600 text-sm font-medium mb-2">
                IMDb ID
              </label>
              <input
                v-model="formData.imdb_id"
                type="text"
                pattern="tt[0-9]+"
                maxlength="20"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
                placeholder="tt1234567"
              />
              <p class="text-gray-400 text-xs mt-1">Format: tt followed by numbers</p>
            </div>

            <!-- IMDb 评分 -->
            <div>
              <label class="block text-gray-600 text-sm font-medium mb-2">
                IMDb Rating
              </label>
              <input
                v-model.number="formData.imdb_rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
                placeholder="e.g., 8.5"
              />
            </div>

            <!-- IMDb 投票数 -->
            <div>
              <label class="block text-gray-600 text-sm font-medium mb-2">
                IMDb Votes
              </label>
              <input
                v-model.number="formData.imdb_votes"
                type="number"
                min="0"
                class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue"
                placeholder="e.g., 10000"
              />
            </div>
          </div>
        </div>

        <!-- 内容详情 -->
        <div class="bg-white p-6 rounded-lg border border-datawhale-gray shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Content Details</h2>
          
          <!-- 描述 -->
          <div class="mb-4">
            <label class="block text-gray-600 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              maxlength="500"
              class="w-full bg-datawhale-lightgray text-gray-800 px-4 py-3 rounded border border-datawhale-gray focus:outline-none focus:ring-2 focus:ring-datawhale-blue resize-none"
              placeholder="Enter movie description..."
            ></textarea>
            <p class="text-gray-400 text-xs mt-1">{{ formData.description?.length || 0 }} / 500 characters</p>
          </div>

          <!-- 电影类型 -->
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-3">
              Genres
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label 
                v-for="genre in availableGenres" 
                :key="genre"
                class="flex items-center space-x-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  :value="genre"
                  v-model="formData.genres"
                  class="w-4 h-4 rounded bg-datawhale-lightgray border-gray-300 text-datawhale-blue focus:ring-datawhale-blue focus:ring-2"
                />
                <span>{{ genre }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 海报上传 -->
        <div class="bg-white p-6 rounded-lg border border-datawhale-gray shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Poster Image</h2>
          
          <div class="space-y-4">
            <!-- 文件输入 -->
            <div>
              <label class="block text-gray-600 text-sm font-medium mb-2">
                Upload Poster
              </label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-datawhale-blue transition-colors cursor-pointer"
                @click="$refs.fileInput.click()"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                :class="{ 'border-datawhale-blue bg-datawhale-blue/10': isDragging }"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/png,image/jpeg"
                  @change="handleFileSelect"
                  class="hidden"
                />
                
                <div v-if="!posterPreview">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="text-gray-500 mb-1">Click to upload or drag and drop</p>
                  <p class="text-gray-400 text-sm">PNG or JPG (max 5MB)</p>
                  <p class="text-gray-400 text-xs mt-1">Recommended: 500x750 pixels</p>
                </div>

                <div v-else class="relative">
                  <img :src="posterPreview" alt="Poster preview" class="max-h-64 mx-auto rounded" />
                  <button
                    type="button"
                    @click.stop="clearPoster"
                    class="absolute top-2 right-2 bg-datawhale-blue text-white rounded-full p-2 hover:bg-blue-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p v-if="posterFile" class="text-green-600 text-sm mt-2">
                ✓ {{ posterFile.name }} ({{ (posterFile.size / 1024 / 1024).toFixed(2) }} MB)
              </p>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex justify-end space-x-4">
          <router-link
            to="/"
            class="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="loading || !formData.title"
            class="px-6 py-3 bg-datawhale-blue text-white font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating Movie...' : 'Add Movie' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { movieApi } from '../services/api'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const isDragging = ref(false)
const posterFile = ref(null)
const posterPreview = ref('')

const formData = reactive({
  title: '',
  year: null,
  runtime_minutes: null,
  title_type: '',
  imdb_id: '',
  imdb_rating: null,
  imdb_votes: null,
  description: '',
  genres: []
})

const availableGenres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir',
  'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
  'Thriller', 'War', 'Western'
]

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetPoster(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetPoster(file)
  }
}

const validateAndSetPoster = (file) => {
  // 验证文件类型
  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    error.value = 'Invalid file type. Please upload PNG or JPEG.'
    return
  }

  // 验证文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File too large. Maximum size is 5MB.'
    return
  }

  posterFile.value = file
  error.value = ''

  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    posterPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearPoster = () => {
  posterFile.value = null
  posterPreview.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    // 准备电影数据（移除 null/空值）
    const movieData = {}
    if (formData.title) movieData.title = formData.title
    if (formData.year) movieData.year = formData.year
    if (formData.runtime_minutes) movieData.runtime_minutes = formData.runtime_minutes
    if (formData.title_type) movieData.title_type = formData.title_type
    if (formData.imdb_id) movieData.imdb_id = formData.imdb_id
    if (formData.imdb_rating) movieData.imdb_rating = formData.imdb_rating
    if (formData.imdb_votes) movieData.imdb_votes = formData.imdb_votes
    if (formData.description) movieData.description = formData.description
    if (formData.genres.length > 0) movieData.genres = formData.genres

    const response = await movieApi.createMovie(movieData, posterFile.value)
    
    // 成功！重定向到新电影页面
    const newMovieId = response.data.movie_id
    router.push(`/movie/${newMovieId}`)
    
  } catch (err) {
    console.error('Error creating movie:', err)
    error.value = err.response?.data?.detail || 'Failed to create movie. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>


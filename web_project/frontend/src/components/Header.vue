<template>
  <header class="fixed top-0 w-full z-50 transition-all duration-300" :class="{ 'bg-white shadow-md': scrolled, 'bg-gradient-to-b from-white/90 to-transparent': !scrolled }">
    <div class="flex items-center justify-between px-8 py-4">
      <!-- Logo -->
      <div class="flex items-center space-x-8">
        <router-link to="/" class="flex items-center">
          <h1 class="text-datawhale-blue text-3xl font-bold tracking-tight">FUNREC</h1>
        </router-link>
        
        <!-- 导航栏 -->
        <nav class="hidden md:flex space-x-6">
          <router-link to="/" class="text-gray-700 hover:text-datawhale-blue transition-colors">
            Home
          </router-link>
        </nav>
      </div>

      <!-- 右侧 - 统计信息、搜索、管理员、认证 -->
      <div class="flex items-center space-x-6">
        <!-- 统计信息 -->
        <div v-if="stats" class="hidden md:flex items-center space-x-4 text-sm text-gray-500">
          <span>{{ stats.movies?.toLocaleString() }} Movies</span>
          <span>•</span>
          <span>{{ stats.users?.toLocaleString() }} Users</span>
        </div>

        <!-- 搜索图标（仅登录用户可见） -->
        <button
          v-if="authStore.isAuthenticated"
          @click="openSearch"
          class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-datawhale-blue transition-colors"
          title="Search Movies (Ctrl+K)"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- 添加电影按钮（仅管理员可见） -->
        <router-link
          v-if="authStore.isAdmin"
          to="/movies/new"
          class="w-8 h-8 bg-datawhale-blue rounded flex items-center justify-center hover:bg-blue-700 transition-colors text-white"
          title="Add Movie"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </router-link>

        <!-- 认证区域 -->
        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
          <router-link
            to="/profile"
            class="flex items-center space-x-2 text-gray-700 hover:text-datawhale-blue transition-colors"
          >
            <div 
              class="w-8 h-8 rounded flex items-center justify-center bg-datawhale-blue"
            >
              <span class="text-white text-sm font-semibold">
                {{ authStore.user.email.charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="hidden md:inline">
              {{ authStore.user.email.split('@')[0] }}              
            </span>
          </router-link>
        </div>
        <div v-else class="flex items-center space-x-4">
          <router-link
            to="/auth"
            class="px-4 py-2 bg-datawhale-blue text-white font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </div>

    <!-- 搜索遮罩层 -->
    <SearchOverlay :is-open="isSearchOpen" @close="closeSearch" />
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { movieApi } from '../services/api'
import { useAuthStore } from '../stores/auth'
import SearchOverlay from './SearchOverlay.vue'

const authStore = useAuthStore()
const scrolled = ref(false)
const stats = ref(null)
const isSearchOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const openSearch = () => {
  isSearchOpen.value = true
}

const closeSearch = () => {
  isSearchOpen.value = false
}

// 搜索快捷键 (Ctrl+K 或 Cmd+K)
const handleKeydown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    if (authStore.isAuthenticated) {
      openSearch()
    }
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
  
  // 获取统计信息
  try {
    const response = await movieApi.getStats()
    stats.value = response.data
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>


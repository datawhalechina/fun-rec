import axios from 'axios'

// API 配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const movieApi = {
  // 获取带分页和筛选条件的电影列表
  getMovies(params = {}) {
    return api.get('/movies', { params })
  },

  // 获取热门电影
  getPopularMovies(limit = 20) {
    return api.get('/movies/popular', { params: { limit } })
  },

  // 获取电影详情
  getMovie(movieId) {
    return api.get(`/movies/${movieId}`)
  },

  // 获取电影演员阵容
  getMovieCast(movieId, limit = 10) {
    return api.get(`/movies/${movieId}/cast`, { params: { limit } })
  },

  // 获取电影主创人员（导演、编剧）
  getMovieCrew(movieId) {
    return api.get(`/movies/${movieId}/crew`)
  },

  // 获取人物详情
  getPerson(personId) {
    return api.get(`/people/${personId}`)
  },

  // 获取统计信息
  getStats() {
    return api.get('/stats')
  },

  // 获取个性化推荐（完整流程：召回 → 排序）
  getRecommendations(userId, topK = 20) {
    const token = localStorage.getItem('token')
    return api.post('/recommendations/recommend', 
      { user_id: userId },
      { 
        headers: { 'Authorization': `Bearer ${token}` },
        params: { top_k: topK }
      }
    ).then(response => {
      // 从响应中提取 items 数组以保持向后兼容
      // 响应格式: { items: [...], recall_count, ranking_strategy }
      return { ...response, data: response.data.items }
    })
  },

  // 管理员：创建电影（可选上传海报）
  createMovie(movieData, posterFile) {
    const formData = new FormData()
    formData.append('movie_data', JSON.stringify(movieData))
    if (posterFile) {
      formData.append('poster', posterFile)
    }
    
    const token = localStorage.getItem('token')
    return api.post('/movies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
  },
}

export const ratingApi = {
  // 创建或更新评分
  createRating(movieId, rating) {
    const token = localStorage.getItem('token')
    return api.post('/ratings', 
      { movie_id: movieId, rating },
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
  },
  
  // 获取用户对某部电影的评分
  getUserRating(movieId) {
    const token = localStorage.getItem('token')
    return api.get(`/ratings/movie/${movieId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  
  // 删除评分
  deleteRating(movieId) {
    const token = localStorage.getItem('token')
    return api.delete(`/ratings/movie/${movieId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }
}

export const searchApi = {
  // 搜索电影
  searchMovies(query, limit = 20) {
    return api.get('/search/movies', {
      params: { q: query, limit }
    }).then(response => response.data)
  },
  
  // 获取搜索建议
  getSuggestions(query, limit = 10) {
    return api.get('/search/suggest', {
      params: { q: query, limit }
    }).then(response => response.data)
  }
}

// 获取海报 URL 的工具函数
export const getPosterUrl = (movieId) => {
  return `${API_BASE_URL}/api/posters/${movieId}.png`
}

export default api


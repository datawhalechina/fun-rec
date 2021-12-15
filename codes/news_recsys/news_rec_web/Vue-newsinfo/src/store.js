import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //需要缓存的组件name
        cacheView: ['recLists', 'hotLists'],
        type: '',
        user: {
            username: '',
            age: '',
            gender: ''
        }
    },
    mutations: {
        // 动态添加及删除缓存
        ADD_CACHE_VIEW: (state, view) => {
            state.cacheView.push(view)
        },
        DELETE_CACHE_VIEW: (state, index) => {
            state.cacheView.splice(index, 1)
        }
    },
    actions: {
        // 动态添加及删除缓存
        addCacheView({ commit, state }, view) {
            if (!state.cacheView.includes(view)) {
                commit('ADD_CACHE_VIEW', view)
            }
        },
        deleteCacheView({ commit, state }, view) {
            const index = state.cacheView.indexOf(view)
            if (index > -1) {
                commit('DELETE_CACHE_VIEW', index)
            }
        }
    },


})

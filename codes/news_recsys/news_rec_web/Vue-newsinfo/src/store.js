import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        type: '',  //signIn,signUp  区分获取接口时的url
        user: {
            username: '',
            age: '',
            gender: ''
        },  //存储用户信息
        recList: [],  //推荐页的新闻列表
        hotList: [],  //热门页的新闻列表
    },
    mutations: {
        //点进新闻详情页时触发，让阅读次数增加
        numChange(state, payload) {
            let reg = /NewsInfo\//
            if(payload.item == 'recList'){
                for (let i = 0; i < state.recList.length; i++) {
                    if (state.recList[i].news_id == payload.path.split(reg)[1]) {
                        state.recList[i].read_num++
                    }
                }
            }else if(payload.item == 'hotList'){
                for (let i = 0; i < state.hotList.length; i++) {
                    if (state.hotList[i].news_id == payload.path.split(reg)[1]) {
                        state.hotList[i].read_num++
                    }
                }
            }
        },

        //点击喜欢或者收藏时触发，让相应次数增加或者减少
        actionChange(state, payload){
            if(payload.type == 'likes'){
                for(let i = 0; i<state.recList.length; i++){
                    if(state.recList[i].news_id == payload.id){
                        state.recList[i].likes +=  payload.num
                    }
                }
                for(let i = 0; i<state.hotList.length; i++){
                    if(state.hotList[i].news_id == payload.id){
                        state.hotList[i].likes += payload.num
                    }
                }
            }else if(payload.type == 'collections'){
                for(let i = 0; i<state.recList.length; i++){
                    if(state.recList[i].news_id == payload.id){
                        state.recList[i].collections += payload.num
                    }
                }
                for(let i = 0; i<state.hotList.length; i++){
                    if(state.hotList[i].news_id == payload.id){
                        state.hotList[i].collections += payload.num
                    }
                }
            }
            
        }
    },
})

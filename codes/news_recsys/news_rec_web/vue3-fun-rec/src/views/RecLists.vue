<template>
  <div>
    <div class="tabs">
      <input type="radio" id="tab1" name="tab-control" checked>
      <input type="radio" id="tab2" name="tab-control">
      <ul>
        <li title="Features" class="rec">
          <label for="tab1" role="button" class="recCont">
            <svg viewBox="0 0 24 24" class="recPath">
              <path d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10H20C20,13.32 17.32,16 14,16A6,6 0 0,1 8,10A6,6 0 0,1 14,4C14.43,4 14.86,4.05 15.27,4.14L16.88,2.54C15.96,2.18 15,2 14,2M20.59,3.58L14,10.17L11.62,7.79L10.21,9.21L14,13L22,5M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z" />
            </svg>
            <br>
            <span>推荐</span>
          </label>
        </li>
        <li title="Delivery Contents" @click="toHot">
          <label for="tab2" role="button">
            <svg viewBox="0 0 24 24">
              <path d="M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z" />
            </svg>
            <br>
            <span>热门</span>
          </label>
        </li>
      </ul>
    </div>
  
    <van-pull-refresh v-model="data.isLoading" @refresh="onRefresh">
      <div class="lists">
        <van-list v-model:loading="data.vanListLoading" :finished="data.finished" :finished-text="data.finishedText" @load="onLoad" :offset=300>
          <!-- 循环store.state.recList内的每一个item并显示 -->
          <van-cell v-for="(item) in store.state.recList" :key="item.news_id">
            <!-- 路由地址传参,需要前面加：号，表示这个参数不是字符串 -->
            <router-link :to="{name:'NewsInfo' ,params:{id:item.news_id,likes:item.likes,collections:item.collections,cate:item.cate}}">
              <div>
                <p>
                  <span class="cate">{{item.cate}}</span>
                  <span class='title'>{{ item.title }}</span>
                </p>

                <p class="discribe">
                  <span class="ctime">{{ item.ctime}} </span>
                  <span class="read_num">阅读：{{item.read_num}}</span>
                  <span class="likes">喜欢:{{item.likes}}</span>
                  <span class="collections">收藏:{{item.collections}}</span>
                </p>
              </div>
            </router-link>
          </van-cell>
        </van-list>
      </div>
    </van-pull-refresh>
    
    <!-- 底部导航栏，多个组件都会用到，需要时直接引入 -->
    <bottomBar></bottomBar>

  </div>
</template>

<script setup>
  import bottomBar from "@/components/bottomBar.vue";
  import {  reactive, onActivated, getCurrentInstance } from "vue";
  import { useStore } from "vuex";
  import { useRouter, onBeforeRouteLeave } from "vue-router";
  const store = useStore();
  const router = useRouter();

  const { proxy } = getCurrentInstance();

  const data = reactive({
    vanListLoading: false, // 加载状态
    finished: false, // 是否加载
    finishedText: '', // 加载完成后的提示文案
    scrollTop:0,
    isLoading: false,
  });

  function onRefresh() {
      // data.isLoading = false;
      // store.commit('clearList', "recList")
      // getList()
      // data.isLoading = true;
      // data.finished = false;
      // data.isLoading = true;
      // getList()
      setTimeout(() => {
      data.isLoading = false;
      store.commit('clearList', "hotList")
      getList()
    }, 1000);
  }

  async function getList() {
    let url;
    if(store.state.type == 'signIn'){
      url = '/recsys/rec_list?' + 'user_id=' + store.state.user.username
    }else if(store.state.type == 'signUp'){
      url = '/recsys/rec_list?' + 'user_id=' + store.state.user.username  + '&age=' + store.state.user.age + '&gender=' + store.state.user.gender
    }

    let successData
    if(store.state.flag){
      successData = await proxy.axios.get(url).then(res => {
        return res
      })
    }else {
      successData = await proxy.axios.get("/recList").then(res => {
        console.log(store.state.recList,'recList')
        return res
      })
    }

    if (successData.data.code === 200) {
      store.state.recList.push(...successData.data.data)
      data.vanListLoading = false
    }
  }

  // vantUi内部函数，当组件滚动到一定位置时触发 load 事件并将 loading 设置成 true
  // offset设置当滚动条距离页面底部300px时会触发 load
  function onLoad() {
    getList();
  }
  function toRec() {
    router.push('/recLists')
  }
  function toHot() {
    router.push('/hotLists')
  }

  // 当组件在 <keep-alive> 内被切换，activated 会被对应执行
  // 每次进入该组件时会执行,设置滚动条的位置
  onActivated(()=>{
    document.documentElement.scrollTop = data.scrollTop
  })

  //在离开该组件时执行，执行完后跳转
  // to:要去到的组件  from:离开的组件(本组件)  next():执行的函数，下一步
  onBeforeRouteLeave((to, from, next) => {
    // 如果下一个去到的组件是新闻详情页，触发store中的numChange函数，使阅读次数+1
      if(to.name == 'NewsInfo' ){
      store.commit('numChange', {item:'recList',path:to.path})
    }
    // 存储离开时的滚动条位置
    data.scrollTop = document.documentElement.scrollTop
    // next()必须要写，不写不会发生跳转
    next();
  })
</script>

<style scoped>
  @import url('../assets/css/test.css');

  .lists {
    position: relative;
    top: 70px;
    padding: 0 10px;
  }

  .title {
    font-size: .4rem;
    color: black;
    font-weight: bolder;
  }

  .cate {
    font-size: .3rem;
    color: #00F;
    margin-right: .25rem;
    padding: .04rem;
    border: 1px solid #00F
  }

  .discribe {
    display: flex;
    justify-content: space-between;
    font-size: .3rem;
    color: #918d8d;
    padding-top: 12px;
  }

  .rec {
    border-bottom: 2px solid #428bff
  }

  .recCont {
    cursor: default;
    color: #428bff;
  }

  .recPath {
    fill: #428bff;
  }

/* .van-pull-refresh {
    overflow: auto;
} */
</style>
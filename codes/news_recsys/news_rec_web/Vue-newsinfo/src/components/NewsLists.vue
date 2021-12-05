<template>
  <div>
    <van-tabs sticky swipeable @scroll="scrollLength" @click="onClick">
      <van-tab title="推荐">
        <van-list v-model="vanListLoading" :finished="finished" :finished-text="finishedText" @load="onLoad" :offset=300>
          <van-cell v-for="item in recContent" :key="item.news_id">
            <!-- 路由地址传参,需要前面加：号，表示这个参数不是字符串 -->
            <router-link :to="{name:'NewsInfo' ,params:{id:item.news_id,likes:item.likes,collections:item.collections,cate:item.cate}}">
              <div>
                <p>
                  <span class="cate">{{item.cate}}</span>
                  <span class='title'>{{ item.title }}</span>
                </p>

                <p class="discribe">
                  <!-- <span class="ctime">发表时间：{{ item.ctime}} </span> -->
                  <span class="read_num">阅读：{{item.read_num}}</span>
                  <span class="likes">喜欢:{{item.likes}}</span>
                  <span class="collections">收藏:{{item.collections}}</span>
                </p>
              </div>
            </router-link>
          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="热门">
        <van-list v-model="vanListLoading2" :finished="finished2" :finished-text="finishedText2" @load="onLoad2" :offset=300>
          <van-cell v-for="item in hotContent" :key="item.news_id">
            <!-- 路由地址传参,需要前面加：号，表示这个参数不是字符串 -->
            <router-link :to="{name:'NewsInfo' ,params:{id:item.news_id,likes:item.likes,collections:item.collections,cate:item.cate}}">
              <div>
                <p>
                  <span class="cate">{{item.cate}}</span>
                  <span class='title'>{{ item.title }}</span>
                </p>

                <p class="discribe">
                  <!-- <span class="ctime">发表时间：{{ item.ctime}} </span> -->
                  <span class="read_num">阅读：{{item.read_num}}</span>
                  <span class="likes">喜欢:{{item.likes}}</span>
                  <span class="collections">收藏:{{item.collections}}</span>
                </p>
              </div>
            </router-link>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>

    <bottomBarVue></bottomBarVue>
  </div>
</template>

<script>
  import bottomBarVue from './bottomBar.vue'
  import {
    Toast
  } from 'mint-ui'
  export default {
    data() {
      return {
        recContent: [],
        hotContent: [],
        clickNum: 0,
        isActive: true,
        vanListLoading: false, // 加载状态
        finished: false, // 是否加载
        finishedText: '', // 加载完成后的提示文案
        page: 0, // 页数


        vanListLoading2: false, // 加载状态
        finished2: false, // 是否加载
        finishedText2: '', // 加载完成后的提示文案
        page2: 0, // 页数

        scrollIn: 0, //进入页面时滚动条位置
        scrollOut: 0, //离开页面时滚动条位置

        scrollTop: 0, //滚动时触发，具体顶部的距离

      }
    },
    components: {
      bottomBarVue
    },
    methods: {
      getNewsList(val) {
        if (val === 0) {
          let userId = localStorage.username,
            pageId = this.recContent.length / 10 + 1
          let url = '/recsys/rec_list?' + 'user_id=' + userId + '&page_id=' + pageId
          this.axios.get(url).then(resource => {
            if (resource.status === 200) {
              this.recContent.push(...resource.data.data)
            } else {
              Toast('加载数据失败')
            }
          })
        }
        this.isActive = true
      },
      getHotList(val) {
        if (val === 0) {
          let userId = localStorage.username,
            pageId = this.hotContent.length / 10 + 1
          let url = '/recsys/hot_list?' + 'user_id=' + userId + '&page_id=' + pageId
          console.log(url)
          this.axios.get(url).then(resource => {
            if (resource.status === 200) {
              this.hotContent.push(...resource.data.data)
              console.log(this.hotContent)
            } else {
              Toast('加载数据失败')
            }
          })
        }
        this.isActive = false
      },

      /*删除cookie*/
      quit() {
        delCookie('username')
      },

      getList() {
        let userId = localStorage.username,
          // pageId = this.recContent.length / 10 + 1
          pageId = this.page
        let url = '/recsys/rec_list?' + 'user_id=' + userId + '&page_id=' + pageId;
        this.axios.get(url).then(res => {
          if (res.status === 200) {
            this.recContent.push(...res.data.data)
            this.vanListLoading = false
          }
        })
      },

      onLoad() {
        this.page++;
        this.getList();
        this.isActive = true
      },


      // 热门
      getList2() {
        let userId2 = localStorage.username,
          pageId2 = this.page2
        let url2 = '/recsys/hot_list?' + 'user_id=' + userId2 + '&page_id=' + pageId2;
        this.axios.get(url2).then(res => {
          if (res.status === 200) {
            this.hotContent.push(...res.data.data)
            this.vanListLoading2 = false
          }
        })
      },

      onLoad2() {
        console.log('load2',this.page2);
        this.page2++;
        this.getList2();
        this.isActive = false
      },
      scrollLength(res) {
        this.scrollTop = res.scrollTop
      },

       onClick(name, title) {
        console.log(this.scrollTop, '11');
        document.body.scrollTop = this.scrollTop;
        
      }
    },
    watch: {},
    computed: {
      isback() {
        return this.$route.path !== '/HomeContainer'
      }

    },
    activated() {
      // 进入该组件后读取数据变量设置滚动位置
      this.scrollIn = document.body.scrollTop;
      document.body.scrollTop = this.scrollOut;
      console.log(this.scrollIn, this.scrollOut, 'scroll-activated');
    },
    beforeRouteLeave(to, from, next) {
      // 离开组件时保存滚动位置
      // 注意, 此时需调用路由守卫`beforeRouterLeave`而非生命周期钩子`deactivated`
      // 因为, 此时利用`deactivated`获取的 DOM 信息已经是新页面得了
      this.scrollOut = document.body.scrollTop;
      console.log(this.scrollIn, this.scrollOut, 'scroll-leave');
      next();
    },
    
    
  }
</script>
<style scoped>
  .title {
    font-size: 1.2rem;
    color: black;
    font-weight: bolder;
  }

  .cate {
    font-size: 1rem;
    color: #00F;
    margin-right: .5rem;
    padding: .08rem;
    border: 1px solid #00F
  }

  .discribe {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
  }
.read_num{
  margin-right: 100px;
}
  .ctime {}

  .likes {}

  .collections {}
</style>
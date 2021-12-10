<template>
  <div class="app-container">
    <!-- <router-view></router-view> -->
    <!-- <keep-alive>
      <router-view :key="key" v-if='$route.meta.keepAlive' />
    </keep-alive>
    <router-view v-if='!$route.meta.keepAlive' /> -->

    <keep-alive :include="cachedViews">
      <router-view v-if="this.$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view :key="key" v-if="!this.$route.meta.keepAlive"></router-view>

  </div>
</template>
<script>
import common from './components/common.vue'
  export default {
    data() {
      return {
        cachedViews: []
        // key:common.user.username
      }
    },
    methods: {


    },

    watch: {
      //监听动态缓存动态赋值控制页面是否缓存
      $route: {
        handler:function(to,from){
          this.cachedViews = this.$store.state.cacheView;
        }
      }
    },
    
    computed: {
      cachedViews () {
        return this.$store.state.cachedViews.cachedViews
      },
      key () {
        return common.user.username
      },
    },
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body,
  html {
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
  }

  /* 去掉获取焦点时的边框 */
  input {
    background: none;
    border: none;
    outline: none;
    display: black;
  }

  /* 登录注册页面输入框 */
  input[type='text'],
  input[type='password'] {
    background-color: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    font-size: 1.2rem;
    color: white !important;
    height: 1.5rem !important;
  }
</style>

<style scoped>
  /* input框 */
  /deep/ .van-cell__value {
    color: white;
    width: 100%;
    padding: .7rem 1rem .3rem 1rem;
    outline: none;
    border-radius: 1.5rem;
    background-color: rgba(255, 255, 255, 0.25);
    letter-spacing: 1px;
    min-height: 2rem;
    margin-top: 1.5rem;
  }

  /deep/ .van-cell__value:hover,
  /deep/.van-cell__value:focus {
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: transparent;
  }

  /deep/ .login-container [data-v-7ba5bd90] .van-cell__value {
    height: 2rem;
}

  /* radio */
  /deep/ .van-radio-group--horizontal {
    justify-content: space-around
  }

  /* radio的label */
  /deep/ .van-radio__label {
    color: rgba(255, 255, 255, 0.25);
    font-size: .9rem;
  }

  /* 复选框label的颜色 */
  /deep/ .van-checkbox__label {
    color: white;
    font-size: .9rem;
  }

  /* 新闻列表上下左右留白 */
  /deep/ [data-v-7c729b82] .van-cell__value {
    margin-top: 1rem;
    padding: 0px 20px;
    height: 6rem;
  }

  /* tab高度 */
  /deep/ .van-tabs--line .van-tabs__wrap {}

  /* tab选中的颜色 */
  /deep/ .van-tabs__line {
    background-color: #1989FA;
  }

  /* tab字体 */
  /deep/.van-tab__text--ellipsis {
    font-size: 18px;
    font-weight: 800;
    color: cornflowerblue;
}

  /* navBar标题 */
  /deep/ .van-nav-bar__title {
    max-width: 60%;
    margin: 0 auto;
    color: #323233;
    font-weight: 600;
    font-size: 20px;
  }

  /* 个人中心退出登录按钮 */
  /deep/ span[data-v-4aa99128] {
    font-size: 1rem;
  }

   /* /deep/ .van-tab__pane {
    height: 100vh;
    overflow: auto;
  } */
</style>
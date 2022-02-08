<template>
  <div class="app-container">
    <!-- 从列表跳到详情页，然后返回详情页的时候需要缓存列表页的状态，滚动位置信息，vue里提供了keep-alive组件用来缓存状态
    被keep-alive包裹住的组件在重新进入时不会刷新
    通过设置router中的meta.keepAlive属性值选择需要被缓存的组件
    
    点击退出登录,切换了其他账号登录后,保留的还是上一个账号的数据信息
    通过在keep-alive中绑定isLoggedIn值解决 -->
    <keep-alive v-if="isLoggedIn">
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive||!isLoggedIn"></router-view>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        isLoggedIn:false,
      }
    },

    watch: {
      // 路由发生变化时调用
      $route(to, from) {
        if (this.cookie.getCookie('LoginName')) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
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
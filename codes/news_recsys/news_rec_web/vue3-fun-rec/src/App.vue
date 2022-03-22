<template>
  <router-view v-slot="{ Component }">
    <!-- 在路由节点内配置name属性，且保证为唯一标识 -->
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name"/>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name"/>
  </router-view>
</template>

<script setup>
import { useStore } from "vuex";
const store = useStore();
// 在页面加载时读取sessionStorage里的状态信息
if (sessionStorage.getItem('store')) {
  // 存储状态
  store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))))
}

// 在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('store', JSON.stringify(store.state))
})
  
</script>

<style lang="less">
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
  :deep(.van-cell__value:hover),
  :deep(.van-cell__value:focus) {
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: transparent;
  }
</style>

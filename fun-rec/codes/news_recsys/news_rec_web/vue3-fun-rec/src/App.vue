<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

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

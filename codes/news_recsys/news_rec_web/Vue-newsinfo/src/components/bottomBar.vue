<template>
  <div class="bottomBar">
    <router-view />
    <van-tabbar route>
      <van-tabbar-item icon="home-o" replace to="/recLists">首页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" replace to="/Myself">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'bottomBar',
    data() {
      return {
        flag: false,
      }
    },
    methods: {
      goBack() {
        // 利用vue路由里的go对象，-1进行往前返回的跳转，
        this.$router.go(-1)
      },
    },

    computed: {
      isback() {
        return this.$route.path !== '/HomeContainer'
      }

    }
  }
</script>

<style scoped>
  .bottomBar {
    position: fixed;
    bottom: 0px;
    width: 100vw;
  }
</style>
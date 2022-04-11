<template>
  <div class="my-info">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

    <div class="profile">
      <div class="profile-pic">
        <div class="header-color"></div>
        <img class="tx" src="../assets/images/datawhale.png" alt="头像">
      </div>
      <div class="title">
        <h1>{{data.username}}</h1>
      </div>
      <button class="follow" @click="quit">退出登录</button>
      <div class="description">
        <h4 class="about">DataWhale 新闻推荐开源项目</h4>
        <p class="datawhale">Datawhale是一个专注于数据科学与AI领域的开源组织，汇集了众多领域院校和知名企业的优秀学习者，
          聚合了一群有开源精神和探索精神的团队成员。Datawhale 以“for the learner，和学习者一起成长”为愿景，
          鼓励真实地展现自我、开放包容、互信互助、敢于试错和勇于担当。同时 Datawhale 用开源的理念去探
          索开源内容、开源学习和开源方案，赋能人才培养，助力人才成长，建立起人与人，人与知识，人与企业和
          人与未来的联结。</p>
        <img src="../assets/images/dw.png" alt="二维码" class="dwimg">
      </div>

      <!-- 底部导航栏，多个组件都会用到，需要时直接引入 -->
      <bottomBarVue></bottomBarVue>
    </div>
  </div>
</template>


<script setup>
  import bottomBarVue from "@/components/bottomBar.vue"
  import { routerKey, useRouter } from "vue-router";
  import { Toast } from 'vant'
  import { reactive, getCurrentInstance } from "vue";
  import { useStore } from "vuex";
  const store = useStore();
  const router = useRouter();

  const { proxy } = getCurrentInstance();

  const data = reactive({
    username: 'user'
  });

  function  quit() {
    // 退出登录时清空该用户信息
    store.commit('clearUser');

    /*删除cookie*/
    proxy.cookie.clearCookie('LoginName')
    proxy.cookie.clearCookie('openId')

    // 跳转到登录页
    Toast({
      message: '退出成功',
      icon:'passed'
    });
    
    let second = 1;
    // 延迟一秒执行
    const timer = setInterval(() => {
      second--;
      if (!second) {
          clearInterval(timer);
        // 手动清除 Toast
        Toast.clear();
        router.push('/signIn')
      }
    }, 1000);
  }
  
  // 在该组件被创建时触发，将store中的name值赋给username并显示
  data.username = store.state.user.username
  

</script>


<style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap");

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    height: 100vh;
    display: grid;
    background: #ede1e7;
    font-family: "Open Sans", sans-serif;
  }

  .profile {
    margin: auto;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: scroll;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .header-color {
    padding-bottom: 150px;
    width: 100vh;
    background: #4f759b;
  }

  .profile-pic img {
    height: 40vw;
    width: 40vw;
    border-radius: 50%;
    border: 10px solid #ffffff;
    margin-top: -100px;
  }

  .title {
    margin-bottom: 25px;
  }

  h1 {
    font-size: 1rem;
    font-weight: 700;
    color: #131b23;
    margin-bottom: 10px;
    letter-spacing: 0.025em;
  }

  .description {
    margin-bottom: 25px;
    color: #131b23;
    letter-spacing: 0.01em;
  }

  .description p:not(:last-child) {
    margin-bottom: 5px;
  }

  button {
    font-family: "Open Sans", sans-serif;
    color: #ffffff;
    background: #4f759b;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.025em;
    border: none;
    border-radius: 15px;
    min-height: 35px;
    width: 100px;
    margin-bottom: 25px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  button:hover {
    width: 115px;
    background: #4f759be0;
  }

  .about {
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    font-weight: bold;
    font-size: .5rem;
  }

  .datawhale {
    font-size: .4rem;
    padding: 0 20px 20px 20px;
    text-indent: 2em;
    line-height: .8rem;
  }

  .dwimg {
    width: 150px;
    height: 150px;
    display: block;
    margin: 15px auto 100px auto;
  }
</style>
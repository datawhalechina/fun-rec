<template>
  <div class="my-info">
    <van-nav-bar title="个人中心" size="normal" />
    <div class="my-icon">
      <div class="icon-name">
        <img src="../images/datawhale.png" alt="头像">
        <div class="username">{{username}}</div>
      </div>
      <van-button class="quitBto" size="small" plain round type="info" @click="quit">退出登录</van-button>
    </div>
    <!-- <div class="setting">设置</div> -->
    <div class="about">
      DataWhale 新闻推荐开源项目
    </div>
    <div class="datawhale">
      Datawhale是一个专注于数据科学与AI领域的开源组织，汇集了众多领域院校和知名企业的优秀学习者，
      聚合了一群有开源精神和探索精神的团队成员。Datawhale 以“for the learner，和学习者一起成长”为愿景，
      鼓励真实地展现自我、开放包容、互信互助、敢于试错和勇于担当。同时 Datawhale 用开源的理念去探
      索开源内容、开源学习和开源方案，赋能人才培养，助力人才成长，建立起人与人，人与知识，人与企业和
      人与未来的联结。

    </div>
    <img src="../images/dw.png" alt="二维码" class="dwimg">

    <bottomBarVue></bottomBarVue>
  </div>
</template>
<style scoped>
  .content {
    margin-top: 40px;
  }

  .mint-cell {
    min-height: 40px;
  }

  span {
    font-size: 13px;
  }
</style>
<script>
  import bottomBarVue from "./bottomBar.vue"
  export default {
    data() {
      return {
        username: 'user'
      }
    },
    components: {
      bottomBarVue
    },
    methods: {
      quit() {
        /*删除cookie*/
        this.cookie.clearCookie('LoginName')
        this.cookie.clearCookie('openId')
        this.$router.push('/signIn')
      }
    },
    created() {
      // this.username = localStorage.username
      this,
      this.username = this.cookie.getCookie('LoginName')
    }
  }
</script>
<style scoped>
  .my-icon {
    height: 12rem;
    background-color: #1a91e9;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: center
  }

  .icon-name {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-name img {
    display: block;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 3rem;
  }

  .username {
    margin-left: 10px;
    color: white;
    font-size: 1.5rem;
  }

  .about {
    /* display: flex;
    justify-content: space-between; */
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
  }

  .datawhale {
    font-size: 1.2rem;
    padding: 0 20px 20px 20px;
    text-indent: 2em;
    line-height: 2.4rem;
  }

  .dwimg {
    width: 150px;
    height: 150px;
    display: block;
    margin: 15px auto;
  }
</style>
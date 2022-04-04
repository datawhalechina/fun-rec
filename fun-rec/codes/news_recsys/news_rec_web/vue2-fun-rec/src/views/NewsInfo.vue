<template>
  <div>
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" :fixed='isFixed' />
    <div class="newsinfo-continer">
      <div class="newsTitle">
        <!--大标题-->
        <h1>{{ news_content.title }}</h1>
        <!--子标题-->
        <p>
          <span>发布时间：{{ news_content.ctime}}</span>
          <span>标签：{{cate}}</span>
        </p>
        <hr>
      </div>

      <!--内容区域-->
      <div class="content" v-html="content"></div>
      <div class="editor" v-html="editor"></div>

      <div id="action">
        <span>喜欢:
          <img src="../assets/images/likes.png" alt="" v-show="!islike" @click="iflike">
          <img src="../assets/images/likes1.png" alt="" v-show="islike" @click="iflike">
        </span>
        <span>收藏:
          <img src="../assets/images/collects.png" alt="" v-show="!iscollection" @click="ifcollection">
          <img src="../assets/images/collects1.png" alt="" v-show="iscollection" @click="ifcollection">
        </span>
      </div>

    </div>
    <div class="blank"></div>
  </div>

</template>

<script>
  import { Toast } from 'vant'

  export default {
    data() {
      return {
        // 获取路由地址的id,根据这个id来展示不同的数据。
        id: this.$route.params.id,
        news_content: [],
        content: '',
        editor: '',
        islike: false,
        iscollection: false,
        isFixed: true,
        cate: this.$route.params.cate
      }

    },
    methods: {
      // 返回上一页
      onClickLeft() {
        this.$router.go(-1);
      },

      // 获取新闻详情
      async getNewsInfo() {
        let reg = /责任编辑/;
        let user_name = this.$store.state.user.username;

        let successData
        if(this.$store.state.flag){
          successData = await this.axios.get("/recsys/news_detail?news_id=" + this.id + '&user_name=' + user_name).then(res => {
            return res
          })
        }else {
          successData = await this.axios.get("/newsInfo?news_id=" + this.id + '&user_name=' + user_name).then(res => {
            return res
          })
        }

        if (successData.status === 200) {
          this.news_content = successData.data.data
          this.content = this.news_content.content.split(reg)[0]
          this.editor = '责任编辑:' + this.news_content.content.split(reg)[1]
          if (successData.data.data.likes == true) {
            this.islike = true
          } else {
            this.islike = false
          }
          if (successData.data.data.collections == true) {
            this.iscollection = true
          } else {
            this.iscollection = false
          }
        } else {
          Toast('加载数据失败')
        }
      },

      // 发送action为read的请求
      async sendInfo() {
        var val = {
          user_name: this.$store.state.user.username,
          news_id: this.id,
          action_time: Date.now(),
          action_type: 'read',
        }

        let successData
        if(this.$store.state.flag){
          successData = await this.axios.post("/recsys/action", val).then(res => {
            return res
          })
        }else {
          successData = await this.axios.post("/action", val).then(res => {
            return res
          })
        }

        if (successData.status === 200) {} else {
          Toast('加载数据失败')
        }
      },

      // 点击喜欢时发送请求
      async iflike() {
        this.islike = !this.islike
        // 调用store中的actionChange函数控制次数的变化
        if(this.islike == true){
            this.$store.commit('actionChange', {type:'likes',id:this.id,num:1})
          }else{
            this.$store.commit('actionChange', {type:'likes',id:this.id,num:-1})
          }
        var val = {
          user_name: this.$store.state.user.username,
          news_id: this.id,
          action_time: Date.now(),
          action_type: `likes:${this.islike}`,
        }

        let successData
        if(this.$store.state.flag){
          successData = await this.axios.post("/recsys/action", val).then(res => {
            return res
          })
        }else {
          successData = await this.axios.post("/action", val).then(res => {
            return res
          })
        }

        if (successData.status === 200) {
        } else {
          Toast('加载数据失败')
        }
      },

      // 点击收藏时发送请求
      async ifcollection() {
        this.iscollection = !this.iscollection
        if(this.iscollection == true){
           this.$store.commit('actionChange', {type:'collections',id:this.id,num:1})
          }else{
            this.$store.commit('actionChange', {type:'collections',id:this.id,num:-1})
          }
        var val = {
          user_name: this.$store.state.user.username,
          news_id: this.id,
          action_time: Date.now(),
          action_type: `collections:${this.iscollection}`,
        }

        let successData
        if(this.$store.state.flag){
          successData = await this.axios.post("/recsys/action", val).then(res => {
            return res
          })
        }else {
          successData = await this.axios.post("/action", val).then(res => {
            return res
          })
        }

        if (successData.status === 200) {
        } else {
          Toast('加载数据失败')
        }
      }
    },

    // 创建页面时调用函数
    created() {
      this.getNewsInfo()
      this.sendInfo()
    },
  }
</script>

<style scoped>
    /* 标题 */
  .newsTitle {
    padding: 3.5rem 1.5rem 0 1.5rem;
  }

  /* 大标题 */
  .newsTitle h1 {
    text-align: center;
    color: rgb(77,79,83);;
    font-weight: 600;
    padding: 40px 0 20px 0;
    margin: 0;
    font-size: 1.5rem;
  }

  /* 副标题 */
  .newsTitle p {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
    color: #4679e3;
  }

  /* 内容 距离底部padding 遮挡action */
  .newsinfo-continer{
    padding-bottom: 5rem;
    background-color: white;
  }

  /* 具体内容 */
  .content {
    font-size: 1rem;
    padding: 0 20px 20px 20px;
    text-indent: 2em;
    line-height: 2.2rem;
    /* 首行文本缩进 */
    color: rgb(28 27 29);
}

  /* 责任编辑 */
  .editor {
    font-size: 1rem;
    padding: 0 20px 0 20px;
    line-height: 2.2rem;
    text-align: end;
  }

  #action {
    /* margin: 20px 0 20px 0; */
    display: flex;
    justify-content: space-evenly;
  }

  #action>span {
    display: flex;
    padding-top: 2rem;
    padding-bottom: 2rem;
    font-size: 1rem;
  }

  .blank {
    width: 100vw;
    height: 50px;
    position: fixed;
    bottom: 0;
    background-color: white;
  }
</style>
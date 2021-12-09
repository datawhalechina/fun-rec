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
          <!-- <span>点击次数：{{ news_content.click}} </span> -->
          <!-- <span>喜欢：{{ likeNum }} </span>
          <span>收藏：{{ collectNum }} </span> -->
          <span>标签：{{cate}}</span>
        </p>
        <hr>
      </div>

      <!--内容区域-->
      <div class="content" v-html="content"></div>
      <div class="editor" v-html="editor"></div>

      <!--如果使用接口的话使用这个id(就是路由的id值)穿给子组件，用来根据这个值加载对应的评论,没接口就算了-->
      <!-- <Comment :id="this.id"></Comment> -->
      <div id="action">
        <span>喜欢:
          <svg class="icon" aria-hidden="true" v-show="!islike" @click="iflike">
            <use xlink:href="#icon-xihuan1"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-show="islike" @click="iflike">
            <use xlink:href="#icon-xihuan"></use>
          </svg>
        </span>
        <span>收藏:
          <svg class="icon" aria-hidden="true" v-show="!iscollection" @click="ifcollection">
            <use xlink:href="#icon-shoucang"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-show="iscollection" @click="ifcollection">
            <use xlink:href="#icon-shoucang1"></use>
          </svg>
        </span>
      </div>

    </div>
    <div class="blank"></div>
  </div>

</template>

<script>
  import {
    Toast
  } from 'mint-ui'
  import common from './common.vue'

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
        likeNum: this.$route.params.likes,
        collectNum: this.$route.params.collections,
        cate: this.$route.params.cate
      }

    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      getNewsInfo() {
        let reg = /责任编辑/;
        let user_name = localStorage.username;
        this.axios.get("/recsys/news_detail?news_id=" + this.id + '&user_name=' + user_name).then(resource => {
          if (resource.status === 200) {
            this.news_content = resource.data.data
            this.content = this.news_content.content.split(reg)[0]
            this.editor = '责任编辑:' + this.news_content.content.split(reg)[1]
            if (resource.data.data.likes == true) {
              this.islike = true
            } else {
              this.islike = false
            }
            if (resource.data.data.collections == true) {
              this.iscollection = true
            } else {
              this.iscollection = false
            }
          } else {
            Toast('加载数据失败')
          }
        })

      },
      sendInfo() {
        var val = {
          user_name: localStorage.username,
          news_id: this.id,
          action_time: Date.now(),
          action_type: 'read',
        }
        this.axios.post("/recsys/action", val).then(resource => {
          if (resource.status === 200) {} else {
            Toast('加载数据失败')
          }
        })
      },
      iflike() {
        this.islike = !this.islike
        if(this.islike == true){
            for(let i = 0; i<common.hotList.length; i++){
              if(common.hotList[i].news_id == this.id){
                common.hotList[i].likes++
              }
              if(common.recList[i].news_id == this.id){
                common.recList[i].likes++
              }
            }   
          }else{
            for(let i = 0; i<common.hotList.length; i++){
              if(common.hotList[i].news_id == this.id){
                common.hotList[i].likes--
              }
              if(common.recList[i].news_id == this.id){
                common.recList[i].likes--
              }
            }   
          }
        var val = {
          user_name: localStorage.username,
          news_id: this.id,
          action_time: Date.now(),
          action_type: `likes:${this.islike}`,
        }
        this.axios.post("/recsys/action", val).then(resource => {
          if (resource.status === 200) {
            
          } else {
            Toast('加载数据失败')
          }
        })

      },
      ifcollection() {
        this.iscollection = !this.iscollection
        if(this.iscollection == true){
            for(let i = 0; i<common.hotList.length; i++){
              if(common.hotList[i].news_id == this.id){
                common.hotList[i].collections++
              }
              if(common.recList[i].news_id == this.id){
                common.recList[i].collections++
              }
            }   
          }else{
            for(let i = 0; i<common.hotList.length; i++){
              if(common.hotList[i].news_id == this.id){
                common.hotList[i].collections--
              }
              if(common.recList[i].news_id == this.id){
                common.recList[i].collections--
              }
            }   
          }
        var val = {
          user_name: localStorage.username,
          news_id: this.id,
          action_time: Date.now(),
          action_type: `collections:${this.iscollection}`,
        }
        this.axios.post("/recsys/action", val).then(resource => {
          if (resource.status === 200) {
            // this.news_content = resource.data.data
            // console.log(this.news_content)
          } else {
            Toast('加载数据失败')
          }
        })
      }
    },
    created() {
      this.getNewsInfo()
      this.sendInfo()
    },
    components: {
      // Comment
      // bottomBarVue
    }, 
    beforeRouteLeave(to, from, next) {
      //设置下一个路由的meta,让列表页面缓存,即不刷新
      // to.meta.keepAlive = true
      next()
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
    font-size: 16px;
    line-height: 2rem;
  }

  /* 副标题 */
  .newsTitle p {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    color: #226aff;
  }

  /* 内容 距离底部padding 遮挡action */
  .newsinfo-continer[data-v-6bb6e9d1] {
    padding-bottom: 5rem;
    background-color: white;
  }

  /* 具体内容 */
  .content {
    font-size: 14px;
    padding: 0 20px 20px 20px;
    text-indent: 2em;
    /* 首行文本缩进 */
    line-height: 2.2rem;
  }

  /* 责任编辑 */
  .editor {
    font-size: 14px;
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
    display: inline-block;
    padding-top: 2rem;
    padding-bottom: 2rem;
    font-size: 14px;
  }

  .blank {
    width: 100vw;
    height: 50px;
    position: fixed;
    bottom: 0;
    background-color: white;
  }
</style>
<template>
  <div>
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" :fixed='data.isFixed' />
    <div class="newsinfo-continer">
      <div class="newsTitle">
        <!--大标题-->
        <h1>{{ data.news_content.title }}</h1>
        <!--子标题-->
        <p>
          <span>发布时间：{{ data.news_content.ctime}}</span>
          <span>标签：{{data.cate}}</span>
        </p>
        <hr>
      </div>

      <!--内容区域-->
      <div class="content" v-html="data.content"></div>
      <div class="editor" v-html="data.editor"></div>

      <div id="action">
        <span>喜欢:
          <img src="../assets/images/likes.png" alt="" v-show="!data.islike" @click="iflike">
          <img src="../assets/images/likes1.png" alt="" v-show="data.islike" @click="iflike">
        </span>
        <span>收藏:
          <img src="../assets/images/collects.png" alt="" v-show="!data.iscollection" @click="ifcollection">
          <img src="../assets/images/collects1.png" alt="" v-show="data.iscollection" @click="ifcollection">
        </span>
      </div>

    </div>
    <div class="blank"></div>
  </div>

</template>

<script setup>
  import { Toast } from 'vant'
  import {  reactive, getCurrentInstance, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRouter, useRoute  } from "vue-router";
  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  const { proxy } = getCurrentInstance();

  const data = reactive({
    // 获取路由地址的id,根据这个id来展示不同的数据。
    id: route.params.id,
    news_content: [],
    content: '',
    editor: '',
    islike: false,
    iscollection: false,
    isFixed: true,
    cate: route.params.cate
  });

  // 返回上一页
  function onClickLeft() {
    router.go(-1);
  }

  // 获取新闻详情
  async function getNewsInfo() {
    let reg = /责任编辑/;
    let user_name = store.state.user.username;

    let successData
    if(store.state.flag){
      successData = await proxy.axios.get("/recsys/news_detail?news_id=" + data.id + '&user_name=' + user_name).then(res => {
        return res
      })
    }else {
      successData = await proxy.axios.get("/newsInfo?news_id=" + data.id + '&user_name=' + user_name).then(res => {
        return res
      })
    }

    console.log(successData);

    if (successData.status === 200) {
      data.news_content = successData.data.data
      data.content = data.news_content.content.split(reg)[0]
      data.editor = '责任编辑:' + data.news_content.content.split(reg)[1]
      if (successData.data.data.likes == true) {
        data.islike = true
      } else {
        data.islike = false
      }
      if (successData.data.data.collections == true) {
        data.iscollection = true
      } else {
        data.iscollection = false
      }
    } else {
      Toast('加载数据失败')
    }
  }

  // 发送action为read的请求
  async function sendInfo() {
    var val = {
      user_name: store.state.user.username,
      news_id: data.id,
      action_time: Date.now(),
      action_type: 'read',
    }

    let successData
    if(store.state.flag){
      successData = await proxy.axios.post("/recsys/action", val).then(res => {
        return res
      })
    }else {
      successData = await proxy.axios.post("/action", val).then(res => {
        return res
      })
    }

    if (successData.status !== 200) {
      Toast('加载数据失败')
    }
  }

  // 点击喜欢时发送请求
  async function iflike() {
    data.islike = !data.islike
    // 调用store中的actionChange函数控制次数的变化
    if(data.islike == true){
        store.commit('actionChange', {type:'likes',id:data.id,num:1})
      }else{
        store.commit('actionChange', {type:'likes',id:data.id,num:-1})
      }
    var val = {
      user_name: store.state.user.username,
      news_id: data.id,
      action_time: Date.now(),
      action_type: `likes:${data.islike}`,
    }

    let successData
    if(store.state.flag){
      successData = await proxy.axios.post("/recsys/action", val).then(res => {
        return res
      })
    }else {
      successData = await proxy.axios.post("/action", val).then(res => {
        return res
      })
    }

    if (successData.status !== 200) {
      Toast('加载数据失败')
    }
  }

  // 点击收藏时发送请求
  async function ifcollection() {
    data.iscollection = !data.iscollection
    if(data.iscollection == true){
        store.commit('actionChange', {type:'collections',id:data.id,num:1})
      }else{
        store.commit('actionChange', {type:'collections',id:data.id,num:-1})
      }
    var val = {
      user_name: store.state.user.username,
      news_id: data.id,
      action_time: Date.now(),
      action_type: `collections:${data.iscollection}`,
    }

    let successData
    if(store.state.flag){
      successData = await proxy.axios.post("/recsys/action", val).then(res => {
        return res
      })
    }else {
      successData = await proxy.axios.post("/action", val).then(res => {
        return res
      })
    }

    if (successData.status !== 200) {
      Toast('加载数据失败')
    }
  }
  

  // 创建页面时调用函数
  getNewsInfo()
  sendInfo()

  
</script>

<style scoped>
    /* 标题 */
  .newsTitle {
    padding: 1.5rem .5rem 0 .5rem;
  }

  /* 大标题 */
  .newsTitle h1 {
    text-align: center;
    color: rgb(77,79,83);;
    font-weight: 600;
    padding: 20px 0 10px 0;
    margin: 0;
    font-size: .6rem;
  }

  /* 副标题 */
  .newsTitle p {
    font-size: .3rem;
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
    font-size: .35rem;
    padding: 0 20px 20px 20px;
    text-indent: 2em;
    line-height: .7rem;
    /* 首行文本缩进 */
    color: rgb(28 27 29);
}

  /* 责任编辑 */
  .editor {
    font-size: .3rem;
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
    font-size: .3rem;
  }

  .blank {
    width: 100vw;
    height: 50px;
    position: fixed;
    bottom: 0;
    background-color: white;
  }
</style>
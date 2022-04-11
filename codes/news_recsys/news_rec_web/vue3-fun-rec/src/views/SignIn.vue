<template>
  <div class="login-container">
    <ul class="login-nav">
      <li class="login-nav__item active">
        <a @click="to('/')">登录</a>
      </li>
      <li class="login-nav__item">
        <a @click="to('/signUp')">注册</a>
      </li>
    </ul>

    <label for="login-input-user" class="login__label">
      用户名
    </label>
    <van-field v-model="data.model.username" placeholder="请输入用户名" />

    <label for="login-input-password" class="login__label">
      密码
    </label>
    <van-field v-model="data.model.passwd" placeholder="请输入密码" type="password" />

    <van-checkbox v-model="data.checked" shape="square" icon-size="15px" checked-color="#26a2ff" class="login__label--checkbox">记住我</van-checkbox>

    <button class="login__submit" @click="login">登录</button>

    <a href="#" class="login__forgot">忘记密码?</a>

  </div>

</template>

<script setup>
import { Toast } from 'vant'
import encrypt from '../assets/js/encrypt'

import {  reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();

const { proxy } = getCurrentInstance();

const data = reactive({
  model: {
    username: '',
    passwd: '',
  },
  val: 'login',
  checked: false,
});

async function login() {
  let url = '/recsys/login';
  //密码解密
  let res = {username: data.model.username, passwd: encrypt.Decrypt(data.model.passwd)};
  let successData

  if(store.state.flag){
    successData = await proxy.axios.post(url, res).then(res => {
      return res
    })
  }else {
    successData = await proxy.axios.post("/login", res).then((res)=>{
      return res
    })
  }
  
  if (successData.data.code === 200) {
    let loginInfo = {
      LoginName: res.username,
      openId: "asfafsfsfsdfsdfsdfdsf"
    }

    // checke:true--选中记住我   checke:false--未选中记住我
    if(data.checked){
      // 调用setCookie方法，同时传递需要存储的数据，保存天数
      proxy.cookie.setCookie(loginInfo, 7)
    }else{
      proxy.cookie.setCookie(loginInfo, 1)
    }

    store.state.type = 'signIn'
    store.state.user.username = res.username

    Toast({
      message: '登陆成功',
      icon:'success'
    });
    
    let second = 1;
    // 延迟一秒执行
    const timer = setInterval(() => {
      second--;
      if (!second) {
        clearInterval(timer);
        // 手动清除 Toast
        Toast.clear();
        router.push({name:'recLists' ,params:{type:'signIn',username:data.model.username}})
      }
    }, 1000);

  }if(successData.data.code === 500){
    Toast('登陆失败')
  }if(successData.data.code === 501){
    Toast('密码输入错误')
  }if(successData.data.code === 502){
    Toast('用户名不存在')
  }
}

// 页面跳转
function to(path){
  router.push(path)
}
</script>

<style scoped lang="less">
  /* container */
  .login-container {
    height: 100vh;
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    line-height: 1;
    letter-spacing: 1px;
    display: block;
    position: relative;
    z-index: 0;
    background-image: url(https://img0.baidu.com/it/u=3564438015,1736378667&fm=26&fmt=auto);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: 100% 100%;
    background-color: black;
    padding: 1rem;
    height: 100vh;

    /* 登录和注册的切换 */
    .login-nav {
      position: relative;
      padding: 0;
      margin: 0 0 3em .5rem;

      .login-nav__item {
        list-style: none;
        display: inline-block;
        a {
          position: relative;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          text-transform: uppercase;
          font-weight: 500;
          font-size: .5rem;
          padding-bottom: .25rem;
          transition: .20s all ease;
          &:hover{
            color: #ffffff;
            transition: .15s all ease;
          }
          &:after{
          content: '';
          display: inline-block;
          height: 10px;
          background-color: rgb(255, 255, 255);
          position: absolute;
          right: 100%;
          bottom: -1px;
          left: 0;
          border-radius: 50%;
          transition: .15s all ease;
        }
        }
        &+.login-nav__item {
          margin-left: 1.12rem;
        }
      }
       .active {
         a {
          color: #ffffff;
          transition: .15s all ease;
          &:after {
            background-color: rgb(17, 97, 237);
            height: 2px;
            right: 0;
            bottom: 2px;
            border-radius: 0;
            transition: .20s all ease;
          }
        }
       }
    }
    // :deep(.van-cell__value){
    //   height: .5rem;
    // }
  }

  .login-nav__item a:hover:after{
    background-color: rgb(17, 97, 237);
    height: 2px;
    right: 0;
    bottom: 2px;
    border-radius: 0;
    transition: .20s all ease;
  }

  :deep(.van-cell__value) {
    margin-top: 0;
    background-color: rgba(255, 255, 255, 0.25);
    min-height: 1rem;
    border-radius: .75rem;
    padding: .35rem .5rem .15rem .5rem;
  }

  :deep(.van-cell ){
    padding: 0;
    line-height: 0;
    background: 0;
  }
  :deep(.van-cell:after) {
    border-bottom: none;
}
  :deep(.van-field__control) {
    color: #ffffff;
  }
  /* label标签 */
  .login__label {
    display: block;
    padding-left: .5rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    font-size: .36rem;
    margin-bottom: .5rem;
    margin-top: .75rem;
  }

  /* 提交按钮 */
  .login__submit {
    color: #ffffff;
    font-size: .35rem;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 1rem;
    padding: .36rem;
    border-radius: 1rem;
    display: block;
    width: 100%;
    background-color: rgba(17, 97, 237, .75);
    border: none;
    cursor: pointer;

    &:hover {
      background-color: rgba(17, 97, 237, 1);
  }
  }

  .login__label{
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    font-size: .36rem;
    margin-bottom: .5rem;
  }

  .login__label--checkbox {
    font-size: .36rem;
    margin-bottom: .5rem;
    display: flex;
    position: relative;
    margin-top: 1rem;
  }

  .login__input--checkbox {
    position: absolute;
    top: .05rem;
    left: 0;
    margin: 0;
  }

  :deep(.van-checkbox__label) {
    color: #ffffff;
}

  .login__forgot {
    display: block;
    margin-top: 3rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.75);
    font-size: .36rem;
    text-decoration: none;
    position: relative;
    z-index: 1;

    &:hover {
    color: rgb(17, 97, 237);
    }
  }
</style>
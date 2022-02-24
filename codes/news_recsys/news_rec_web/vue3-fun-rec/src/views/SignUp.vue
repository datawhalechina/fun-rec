<template>
  <div class="login-container">
    <ul class="login-nav">
      <li class="login-nav__item">
        <a @click="to('/')">登录</a>
      </li>
      <li class="login-nav__item active">
        <a @click="to('/signUp')">注册</a>
      </li>
    </ul>

      <label for="login-input-user" class="login__label">
      用户名
      </label>
      <van-field v-model="data.model.username" placeholder="请输入用户名" required @blur='ruleName(data.model.username)' />
      <span class="errorMessage">{{data.message.username}}</span>

      <label for="login-input-password" class="login__label">
        密码
      </label>
      <van-field v-model="data.model.passwd" placeholder="请输入密码" type="password" required @blur='rulePasswd(data.model.passwd)' />
      <span class="errorMessage">{{data.message.passwd}}</span>

      <label for="login-input-user" class="login__label">
        验证密码
      </label>
      <van-field v-model="data.model.passwd2" placeholder="再次输入密码" type="password" required @blur='rulePasswd2(data.model.passwd2)' />
      <span class="errorMessage">{{data.message.passwd2}}</span>

      <label for="login-input-user" class="login__label">
        年龄
      </label>
      <van-field v-model="data.model.age" placeholder="请输入年龄" required @blur='ruleAge(data.model.age)' />
      <span class="errorMessage">{{data.message.age}}</span>

      <label for="login-input-user" class="login__label">
        性别
      </label>
      <van-radio-group class="login__label_male" v-model="data.model.gender" direction="horizontal" icon-size='16px'>
        <van-radio name="male">男</van-radio>
        <van-radio name="female">女</van-radio>
      </van-radio-group>

      <label for="login-input-user" class="login__label">
        城市
      </label>
      <van-field v-model="data.model.city" readonly is-link name="area" placeholder="点击选择省市" @click="data.showArea = true" />
      <van-popup v-model:show="data.showArea" position="bottom">
        <van-area :area-list="data.areaList" @confirm="onConfirm" @cancel="data.showArea = false" :columns-num="2" />
      </van-popup>

      <button class="login__submit" @click="login">注册</button>
    
  </div>

</template>

<script setup>
  import {
    areaList
  } from '@vant/area-data';
  import { Toast } from 'vant'

  import encrypt from '../assets/js/encrypt'
  import {  reactive, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  const router = useRouter();
  const store = useStore();

  const data = reactive({
    model: {
      username: '',
      passwd: '',
      passwd2: '',
      city: '',
      age: '',
      gender: 'male',
    },
    state: '',
    message: {
      username: '',
      passwd: '',
      passwd2: '',
      age: ''
    },
    val: 'register',
    isLogin: true,
    showArea: false,
    areaList: areaList
  });

  const { proxy } = getCurrentInstance();

  async function login() {
    let url = '/recsys/register'
    let res = JSON.parse(JSON.stringify(data.model))

    //密码加密
    res.passwd = encrypt.Encrypt(res.passwd)

  if(data.state && data.model.city){
    let successData
    if(store.state.flag){
      successData = await proxy.axios.post(url, res).then(res => {
        return res
      })
    }else {
      successData = await proxy.axios.post("/register", res).then((res)=>{
        return res
      })
    }
    
    if (successData.data.code === 200) {
      let loginInfo = {
        LoginName: res.username,
        openId: "asdasdadasdasdadad"
      }

      // 调用setCookie方法，同时传递需要存储的数据，保存天数
      proxy.cookie.setCookie(loginInfo, 7)

      //将信息存入store 全部组件都可以使用
      store.state.type = 'signUp'
      store.state.user.username = res.username
      store.state.user.age = data.model.age
      store.state.user.gender = data.model.gender

      Toast({
        message: '注册成功',
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
          router.push('/recLists')
        }
      }, 1000);

    } if(successData.data.code === 500) {
        Toast('用户名已存在')
      }
    } else {
      Toast('请完整填写注册信息')
    }
  }

  // 页面跳转
  function to(path){
    router.push(path)
  }

  //处理选择的城市
  function getCity(city) {
    data.model.city = city.join('-')
  }

  // 验证用户名
  function ruleName(val) {
    var nameReg = /^[A-Za-z0-9]+$/
    if (val == '') {
      data.message.username = '请输入用户名'
      data.state = false
      return false
    } else
    if (!nameReg.test(val)) {
      data.message.username = '用户名格式为字母和数字'
      data.state = false
      return false
    } else {
      data.message.username = ''
      data.state = true
    }
  }

  // 验证密码
  function  rulePasswd(val) {
    var reg = /^[A-Za-z0-9]{6,}$/
    if (val == '') {
      data.message.passwd = '请输入密码'
      data.state = false
      return false
    } else
    if (!reg.test(val)) {
      data.message.passwd = '密码长度至少6位，仅包括为字母和数字'
      data.state = false
      return false
    } else {
      data.message.passwd = ''
      data.state = true
    }
  }

  //验证密码是否一致
  function  rulePasswd2(val) {
    if (val == '') {
      data.message.passwd2 = '请再次输入密码'
      data.state = false
      return false
    } else
    if (val !== data.model.passwd) {
      data.message.passwd2 = '两次输入的密码不正确'
      data.state = false
      return false
    } else {
      data.message.passwd2 = ''
      data.state = true
    }
  }

  //验证年龄
  function ruleAge(val) {
    var ageReg = /^([1-9][0-9]{0,1}|100)$/
    if (val == '') {
      data.message.age = '请输入年龄'
      data.state = false
      return false
    } else
    if (!ageReg.test(val)) {
      data.message.age = '请输入1-100的整数'
      data.state = false
      return false
    } else {
      data.message.age = ''
      data.state = true
    }
  }

  // 选择城市
  function onConfirm(values) {
    let pinyin = require('js-pinyin');
    data.model.city = values[1].name.slice(0, values[1].name.length - 1) //过滤到市级，删除‘市’
    data.model.city = pinyin.getFullChars(data.model.city) //将汉字转换为拼音
    data.showArea = false;
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
    height: 100%;

    /* 登录和注册的切换 */
    .login-nav {
      position: relative;
      padding: 0;
      margin: 0 0 1em .5rem;

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

  /* radio */
  :deep(.van-radio-group--horizontal) {
    justify-content: space-around
  }

  /* radio的label */
  :deep(.van-radio__label) {
    color: #ffffff;
    font-size: .35rem;
  }

  /* 复选框label的颜色 */
  :deep(.van-checkbox__label) {
    color: white;
    font-size: .35rem;
  }

  /* 错误信息提示 */
  .errorMessage {
    color: red;
    font-size: .3rem;
    display: block;
    padding: .3rem .2rem;
  }
</style>
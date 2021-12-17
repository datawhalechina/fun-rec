<template>
  <div class="login-container">
    <ul class="login-nav">
      <li class="login-nav__item">
        <a @click="$router.push('/')">登录</a>
      </li>
      <li class="login-nav__item active">
        <a @click="$router.push('/signUp')">注册</a>
      </li>
    </ul>

      <label for="login-input-user" class="login__label">
      用户名
      </label>
      <van-field v-model="model.username" placeholder="请输入用户名" required @blur='ruleName(model.username)' />
      <span class="errorMessage">{{message.username}}</span>

      <label for="login-input-password" class="login__label">
        密码
      </label>
      <van-field v-model="model.passwd" placeholder="请输入密码" type="password" required @blur='rulePasswd(model.passwd)' />
      <span class="errorMessage">{{message.passwd}}</span>

      <label for="login-input-user" class="login__label">
        验证密码
      </label>
      <van-field v-model="model.passwd2" placeholder="再次输入密码" type="password" required @blur='rulePasswd2(model.passwd2)' />
      <span class="errorMessage">{{message.passwd2}}</span>

      <label for="login-input-user" class="login__label">
        年龄
      </label>
      <van-field v-model="model.age" placeholder="请输入年龄" required @blur='ruleAge(model.age)' />
      <span class="errorMessage">{{message.age}}</span>

      <label for="login-input-user" class="login__label">
        性别
      </label>
      <van-radio-group class="login__label_male" v-model="model.gender" direction="horizontal" icon-size='16px'>
        <van-radio name="male">男</van-radio>
        <van-radio name="female">女</van-radio>
      </van-radio-group>

      <label for="login-input-user" class="login__label">
        城市
      </label>
      <van-field readonly clickable name="area" :value="model.city" placeholder="点击选择省市" @click="showArea = true" />
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList" @confirm="onConfirm" @cancel="showArea = false" :columns-num="2" />
      </van-popup>

      <button class="login__submit" @click="login">注册</button>
    
  </div>

</template>

<script>
  import {
    areaList
  } from '@vant/area-data';
  import { Toast } from 'vant'
  export default {
    data() {
      return {
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
        areaList
      }
    },
    methods: {
      login() {
        let url = '/recsys/register'
        let res = this.model

        if(this.state){
          this.axios.post(url, res).then(resource => {
          if (resource.data.code === 200) {
            let loginInfo = {
              LoginName: res.username,
              openId: "asdasdadasdasdadad"
            }

            // 调用setCookie方法，同时传递需要存储的数据，保存天数
            this.cookie.setCookie(loginInfo, 7)

            //将信息存入store 全部组件都可以使用
            this.$store.state.type = 'signUp'
            this.$store.state.user.username = res.username
            this.$store.state.user.age = this.model.age
            this.$store.state.user.gender = this.model.gender

            this.$router.push('/recLists')
        
          }if(resource.data.code === 500) {
            Toast('用户名已存在')
          }
        })
        }
      },

      //处理选择的城市
      getCity(city) {
        this.model.city = city.join('-')
      },

      // 验证用户名
      ruleName(val) {
        var nameReg = /^[A-Za-z0-9]+$/
        if (val == '') {
          this.message.username = '请输入用户名'
          this.state = false
          return false
        } else
        if (!nameReg.test(val)) {
          this.message.username = '用户名格式为字母和数字'
          this.state = false
          return false
        } else {
          this.message.username = ''
          this.state = true
        }
      },

      // 验证密码
      rulePasswd(val) {
        var reg = /^[A-Za-z0-9]{6,}$/
        if (val == '') {
          this.message.passwd = '请输入密码'
          this.state = false
          return false
        } else
        if (!reg.test(val)) {
          this.message.passwd = '密码长度至少6位，仅包括为字母和数字'
          this.state = false
          return false
        } else {
          this.message.passwd = ''
          this.state = true
        }
      },

      //验证密码是否一致
      rulePasswd2(val) {
        if (val == '') {
          this.message.passwd2 = '请再次输入密码'
          this.state = false
          return false
        } else
        if (val !== this.model.passwd) {
          this.message.passwd2 = '两次输入的密码不正确'
          this.state = false
          return false
        } else {
          this.message.passwd2 = ''
          this.state = true
        }
      },

      //验证年龄
      ruleAge(val) {
        var ageReg = /^([1-9][0-9]{0,1}|100)$/
        if (val == '') {
          this.message.age = '请输入年龄'
          this.state = false
          return false
        } else
        if (!ageReg.test(val)) {
          this.message.age = '请输入1-100的整数'
          this.state = false
          return false
        } else {
          this.message.age = ''
          this.state = true
        }
      },

      // 选择城市
      onConfirm(values) {
        let pinyin = require('js-pinyin');
        this.model.city = values[1].name.slice(0, values[1].name.length - 1) //过滤到市级，删除‘市’
        this.model.city = pinyin.getFullChars(this.model.city) //将汉字转换为拼音
        this.showArea = false;
      },
    }
  }
</script>

<style scoped>
  /* 错误信息提示 */
  .errorMessage {
    color: red;
    font-size: .8rem;
    display: block;
    padding: 1rem 0 0 1rem;
  }

  /* container */
   .login-container {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
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
    padding: 4rem 4rem 4rem 4rem;
    height: 100vh;
    overflow: auto;
  }

  /* 登录和注册的切换 */
  .login-nav {
    position: relative;
    padding: 0;
    margin: 0 0 3em 1rem;
  }

  .login-nav__item {
    list-style: none;
    display: inline-block;
  }

  .login-nav__item+.login-nav__item {
    margin-left: 2.25rem;
  }

  .login-nav__item a {
    position: relative;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.25rem;
    padding-bottom: .5rem;
    transition: .20s all ease;
  }

  .login-nav__item.active a,
  .login-nav__item a:hover {
    color: #ffffff;
    transition: .15s all ease;
  }

  .login-nav__item a:after {
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

  .login-nav__item a:hover:after,
  .login-nav__item.active a:after {
    background-color: rgb(17, 97, 237);
    height: 2px;
    right: 0;
    bottom: 2px;
    border-radius: 0;
    transition: .20s all ease;
  }

  /* label标签 */
  .login__label {
    display: block;
    padding-left: 1rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    font-size: .75rem;
    margin-bottom: 1rem;
  }

  .login__label {
    margin-top: 1.5rem;
  }

  /* 提交按钮 */
  .login__submit {
    color: #ffffff;
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2rem;
    padding: .75rem;
    border-radius: 2rem;
    display: block;
    width: 100%;
    background-color: rgba(17, 97, 237, .75);
    border: none;
    cursor: pointer;
  }

  .login__submit:hover {
    background-color: rgba(17, 97, 237, 1);
  }
</style>
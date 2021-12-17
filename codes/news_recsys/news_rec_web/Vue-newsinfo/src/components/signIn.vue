<template>
  <div class="login-container">
    <ul class="login-nav">
      <li class="login-nav__item active">
        <a @click="$router.push('/')">登录</a>
      </li>
      <li class="login-nav__item">
        <a @click="$router.push('/signUp')">注册</a>
      </li>
    </ul>

    <label for="login-input-user" class="login__label">
      用户名
    </label>
    <van-field v-model="model.username" placeholder="请输入用户名" />

    <label for="login-input-password" class="login__label">
      密码
    </label>
    <van-field v-model="model.passwd" placeholder="请输入密码" type="password" />

    <van-checkbox v-model="checked" shape="square" icon-size="15px" checked-color="#26a2ff" class="login__label--checkbox">记住我</van-checkbox>

    <button class="login__submit" @click="login">登录</button>

    <a href="#" class="login__forgot">忘记密码?</a>

  </div>

</template>

<script>
  import { Toast } from 'vant'
  export default {
    name: 'signIn',
    data() {
      return {
        model: {
          username: '',
          passwd: '',
        },
        val: 'login',
        checked: false,
      }
    },
    methods: {
      login() {
        let url = '/recsys/login'
        let res = {username: this.model.username, passwd: this.model.passwd}

        this.axios.post(url, res).then(resource => {
          if (resource.data.code === 200) {
            let loginInfo = {
              LoginName: res.username,
              openId: "asfafsfsfsdfsdfsdfdsf"
            }

            // checke:true--选中记住我   checke:false--未选中记住我
            if(this.checked){
              // 调用setCookie方法，同时传递需要存储的数据，保存天数
              this.cookie.setCookie(loginInfo, 7)
            }else{
              this.cookie.setCookie(loginInfo, 1)
            }

            this.$store.state.type = 'signIn'
            this.$store.state.user.username = res.username
            this.$router.push({name:'recLists' ,params:{type:'signIn',username:this.model.username}})
          
          }if(resource.data.code === 500){
            Toast('登陆失败')
          }if(resource.data.code === 501){
            Toast('密码输入错误')
          }if(resource.data.code === 502){
            Toast('用户名不存在')
          }
        })
      },
    },
  }
</script>

<style scoped>
  /* 登录和注册的切换 */
  .login-nav {
    margin: 0 0 6em 1rem;
  }


  /* container */
  .login-container {
    height: 100vh;
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
  }

  /* 登录和注册的切换 */
  .login-nav {
    position: relative;
    padding: 0;
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

  .login__label{
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    font-size: .75rem;
    margin-bottom: 1rem;
  }

  .login__label--checkbox {
    font-size: .75rem;
    margin-bottom: 1rem;
    display: flex;
    position: relative;
    margin-top: 2rem;
  }

  .login__input--checkbox {
    position: absolute;
    top: .1rem;
    left: 0;
    margin: 0;
  }

  .login__forgot {
    display: block;
    margin-top: 3rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.75);
    font-size: .75rem;
    text-decoration: none;
    position: relative;
    z-index: 1;
  }

  .login__forgot:hover {
    color: rgb(17, 97, 237);
  }
</style>
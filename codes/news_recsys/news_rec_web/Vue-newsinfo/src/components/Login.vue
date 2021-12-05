<template>
    <div class='login-container'>
        <mt-header fixed :title="val">
            <mt-button @click="changeToLogin" icon="back" slot="left" v-show="!isLogin">返回</mt-button>
        </mt-header>

        <div class="info">
            <mt-field label="用户名" placeholder="Input username" v-model="model.username"></mt-field>

            <mt-field label="密码" placeholder="Input password" type="password" v-model="model.passwd"></mt-field>
            <div v-show='!isLogin'>
                <!-- <input type="text" id="name" name="name" required minlength="4" maxlength="8" size="10" class="myInput"> -->
                <mt-field label="验证密码" placeholder="Input password" type="password"></mt-field>
                <mt-field label="年龄" placeholder="Input age" v-model="model.age"></mt-field>
                <mt-field label="性别" placeholder="male/female" v-model="model.gender"></mt-field>
                <mt-field label="城市" placeholder="city" v-model="model.city"></mt-field>
    <!-- 
                <div>
                    <city-picker ref="citypicker" @confirm="getCity"></city-picker>
                    <span>选择城市：</span><button @click="open('citypicker')">选择城市</button><span>{{model.city}}</span>   
                </div> -->

                <!-- 
                <span>性别</span>
                <div @click="sexVisible = true">{{model.gender}}</div>
                <div>
                    <mt-popup v-model="sexVisible" position="bottom">
                        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
                    </mt-popup>
                </div> -->



                        
            </div>
        </div>



        <!-- <div class='change'> -->
            <!-- <button @click="changeToLogin">登录</button> -->
            <!-- <button @click="changeToRegister">注册</button> -->
        <!-- </div> -->
        <div class="ensure">
            <mt-button type="primary" size='large' @click="login">确认{{this.val}}</mt-button>
        </div>
        <div class='center'>
            <div v-if='isLogin'>
                未创建帐号，立即<span @click="changeToRegister">注册</span>
            </div>
            <div v-else> 
                已有帐号，立即<span @click="changeToLogin">登录</span>
            </div>
            
            
        </div>

    </div>
</template>

<script>    
import { DatetimePicker,Toast,Popup,Picker  } from 'mint-ui';
export default {
    data(){
        return{
            model:{
                username: '',
                passwd: '',
                city: '',
                age: '',
                gender: ''
            },
            val: '登录',
            isLogin: true,
            sexVisible: false,  //选择器的显示与影藏
            slots: [
                {
                        flex: 1,
                        values: ['male','female'],
                        className: 'slot1',
                        textAlign: 'center',
                        flex: 1
                    }

            ],
            city: []
            // sex: '男'
        }
    },
    methods:{
        login(){
            let url =  '/recsys/'
            let state = this.val === '登录' ? 'login' : 'register'
            url += state
            console.log(url)
            let res = this.val !== '登录' ? this.model : {username: this.model.username, passwd: this.model.passwd}
                this.axios.post(url, res).then(resource => {
                    if (resource.status === 200) {
                        // this.news_content = resource.data.data
                        // console.log(this.news_content)
                        localStorage.username = res.username
                        console.log(resource)
                        this.$router.push('/NewsLists')
                    } else {
                        Toast('加载数据失败')
                    }
                })  

        

        },
        open(picker) {
            this.$refs[picker].open();
        },
        getCity(city) {
        //处理选择的城市
        this.model.city = city.join('-')
        console.log(this.model) //得到选择的城市数据
        },
        changeToLogin(){
            this.val = '登录',
            this.isLogin = true
        },
        changeToRegister(){
            this.val = '注册'
            this.isLogin = false
        },
        onValuesChange(picker, values) {
            //console.log(values)
            this.model.gender = values[0];
            this.sexVisible = false;
            console.log(this.model.gender)
        },
    },

}
</script>

<style scoped>
    /* .login-container{

        margin-top: 100px;
    } */

    .login-card{
        width: 25rem;
        margin: 6rem auto; 
    }
    .checkbox{
        margin-bottom: 12px;
    }
    .ensure{
        margin: 2% 20% 0.3% 20%;
    }
    .center{
        text-align: center;
        margin-top: 1rem;
    }
    .center span{
        color: #409EFF;
    }
    .myInput{
        display: inline-block;
        width: 60%;
        margin: 0 20% 0 20%;
    }
    .info{
        margin: 10px 4% 0 4%;
    }
</style>

import { NavLink, useNavigate } from 'react-router-dom'
import {useDispatch} from 'react-redux';

import { Form, Input, Checkbox, Toast } from 'antd-mobile';

import './index.scss'

//引入action
import { userLog } from '../../redux/actions'
import { SIGNIN } from '../../redux/types/constant';

import encrypt from '../../assets/js/encrypt'
import axios from 'axios';
import {setCookie} from '../../assets/js/cookie'
import { UserSignIn } from '../../assets/type';

export const SignIn = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  async function onFinish(values: UserSignIn) {
    
    //密码解密
    let res = { username: values.name, passwd: encrypt.Decrypt(values.passwd) };
    let successData = await axios.post("/login", res).then((res) => {
      return res.data
    })
    
    if (successData.code === 200) {
      let loginInfo = {
        LoginName: res.username,
        openId: "asfafsfsfsdfsdfsdfdsf"
      }

      // checke:true--选中记住我   checke:false--未选中记住我
      if (values.remember) {
        // 调用setCookie方法，同时传递需要存储的数据，保存天数
        setCookie(loginInfo, 7)
      } else {
        setCookie(loginInfo, 1)
      }

      Toast.show({
        icon: 'success',
        content: '登录成功',
      })

      let second = 1;
      // 延迟一秒执行
      const timer = setInterval(() => {
        second--;
        if (!second) {
            clearInterval(timer);
          // 手动清除 Toast
          Toast.clear();
          dispatch(userLog(SIGNIN, res))
          navigate('/recLists', { replace: true })
        }
      }, 1000);

    } else if (successData.code === 500) {
      Toast.show({
        icon: 'fail',
        content: '登陆失败',
      })
    } else if (successData.code === 501) {
      Toast.show({
        icon: 'fail',
        content: '密码输入错误',
      })
    } else if (successData.code === 502) {
      Toast.show({
        icon: 'fail',
        content: '用户名不存在',
      })
    }
  
  }

  return (
    <div className="login-container">
      <ul className="login-nav">
        <li className="login-nav__item active">
          <NavLink to="/signIn">登录</NavLink>
        </li>
        <li className="login-nav__item">
          <NavLink to='/signUp'>注册</NavLink>
        </li>
      </ul>
      <Form
        onFinish={onFinish}
        initialValues={{remember:true}}
        footer={<button className="login__submit">登录</button>}
      >
        
        <label className="login__label">用户名</label>
        <Form.Item name='name'
          rules={[
          	{ required: true, message: '请输入用户名' },
          ]}
        >
          <Input placeholder='请输入用户名' />
        </Form.Item>

        <label className="login__label">密码</label>
        <Form.Item
          name='passwd'
          rules={[
          	{ required: true, message: '请输入密码' },
          ]}
        >
          <Input placeholder='请输入密码' type='password' />
        </Form.Item>

        <Form.Item name='remember'>
          <Checkbox className="login__label--checkbox" defaultChecked
          style={{
            '--icon-size': '18px',
            '--font-size': '14px',
            '--gap': '6px',
          }}>记住我</Checkbox>
        </Form.Item>
   
      </Form>

        {/*<a href="#" className="login__forgot">忘记密码?</a>*/}
    </div>
  )
}

export default SignIn


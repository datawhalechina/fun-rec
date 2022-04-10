import {useState} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Form, Input, Radio, CascadePicker, Toast } from 'antd-mobile'

import city from '../../assets/data/city'
import './index.scss'
import { useDispatch } from 'react-redux'
import { userLog } from '../../redux/actions'
import { SIGNUP } from '../../redux/types/constant'
import encrypt from '../../assets/js/encrypt'
import axios from 'axios'
import { setCookie } from '../../assets/js/cookie'
import { UserSignUp } from '../../assets/type'

let pinyin = require('js-pinyin')


export default function SignUp(){

	// 控制级联选择是否显示
	const [visible, setVisible] = useState(false)
	// 获取选择的城市数据
	const [cityValue, setCityValue] = useState<any>('')

	const dispatch = useDispatch();
	const navigate = useNavigate()

	async function onFinish(values: UserSignUp){
		values.area = cityValue
		//密码加密
		values.passwd = encrypt.Encrypt(values.passwd)
		let successData = await axios.post("/register", values).then((res)=>{
				return res.data
		})
			
		if (successData.code === 200) {
			let loginInfo = {
				LoginName: values.name,
				openId: "asdasdadasdasdadad"
			}

			// 调用setCookie方法，同时传递需要存储的数据，保存天数
			setCookie(loginInfo, 7)
			Toast.show({
				icon: 'success',
				content: '注册成功',
			})
		
			let second = 1;
			// 延迟一秒执行
			const timer = setInterval(() => {
				second--;
				if (!second) {
					clearInterval(timer);
					// 手动清除 Toast
					Toast.clear();
					dispatch(userLog(SIGNUP, values));
					navigate('/recLists', { replace: true }) 
				}
			}, 1000);

		}else if(successData.code === 500) {
				Toast.show({
					icon: 'fail',
					content: '用户名已存在',
				})
		}else {
			Toast.show({
				icon: 'fail',
				content: '请完整填写注册信息',
			})
		}
	}		
	
	const checkName = (_: any, value: string) => {
		let nameReg = /^[A-Za-z0-9]+$/
		if (!nameReg.test(value) && value) {
			return Promise.reject(new Error('用户名格式为字母和数字'))
		} else {
			return Promise.resolve()
		}
	}
	const checkPasswd = (_: any, value: string) => {
		let passwdReg = /^[A-Za-z0-9]{6,}$/
		if (!passwdReg.test(value) && value) {
			return Promise.reject(new Error('密码长度至少6位，仅包括为字母和数字'))
		} else {
			return Promise.resolve()
		}
	}

	const checkAge = (_: any, value: string) => {
		var ageReg = /^([1-9][0-9]{0,1}|100)$/
		if (!ageReg.test(value) && value) {
			return Promise.reject(new Error('请输入1-100的整数'))
			} else {
				return Promise.resolve()
			}
	}
	
  return (
		<div className="login-container">
			<ul className="login-nav">
				<li className="login-nav__item">
					<NavLink to="/signIn">登录</NavLink>
				</li>
				<li className="login-nav__item active">
					<NavLink to='/signUp'>注册</NavLink>
				</li>
			</ul>
			<Form
				onFinish={onFinish}
				initialValues={{gender:'male'}}
        footer={<button className="login__submit">注册</button>}
			>
				
				<label className="login__label">用户名</label>
				<Form.Item name='name'
					rules={[
						{ required: true, message: '请输入用户名' },
						{ validator: checkName}
					]}
				>
          <Input placeholder='请输入用户名' />
				</Form.Item>

				<label className="login__label">密码</label>
				<Form.Item
					name='passwd'
					rules={[
						{ required: true, message: '请输入密码' },
						{ validator: checkPasswd }]
					}
				>
          <Input placeholder='请输入密码' type='password' />
				</Form.Item>

				<label className="login__label">验证密码</label>
				<Form.Item
					name='passwd2'
					dependencies={['passwd']}
					rules={[
						{ required: true, message: '请再次输入密码' },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (getFieldValue('passwd') === value && value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('两次输入的密码不一致'));
							},
						}),
					]}
				>
          <Input placeholder='再次输入密码' type='password' />
				</Form.Item>

				<label className="login__label">年龄</label>
				<Form.Item name='age'
					rules={[
						{ required: true, message: '请输入年龄' },
						{ validator: checkAge }
					]}
				>
          <Input placeholder='请输入年龄' type='number'/>
				</Form.Item>

				<label className="login__label">城市</label>
        <Form.Item
					name='area'
					trigger='onConfirm'
					onClick={() => { setVisible(true) }}
					rules={[
						{ required: true, message: '请选择城市' }
					]}
				>
					<CascadePicker
						title='选择城市'
						options={city}
						visible={visible}
						onClose={() => { setVisible(false) }}
						onConfirm={(val, _) => {
							setCityValue(pinyin.getFullChars(val[0]))
						}}  
					>
						{items => {
							if (items.every(item => item === null)) {
								return '请选择城市'
							} else {
								return items.map(item => item?.label ?? '').join('-')
							}
						}}
					</CascadePicker>
				</Form.Item>
				
				<label className="login__label">性别</label>
        <Form.Item name='gender'>
					<Radio.Group >
						<Radio value='male' style={{
            '--icon-size': '18px',
            '--font-size': '14px',
          }}>男</Radio>
						<Radio value='female' style={{
            '--icon-size': '18px',
            '--font-size': '14px',
          }}>女</Radio>
					</Radio.Group>
        </Form.Item>
      </Form>
    </div>
  )
}
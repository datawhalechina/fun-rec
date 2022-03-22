import React, { Component, useState  } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { Input, Checkbox } from 'antd-mobile';

export interface ISecondProps {}
export interface ISecondState {
  username: string
  passwd: string
}


export default class SignIn extends Component< ISecondProps,ISecondState>{

  constructor(props: ISecondProps) {
    super(props)
    this.state = {
      username: '',
      passwd: ''
    }
    this.login = this.login.bind(this)
  }

  login = () => {
    console.log('login')
  }

  render() {
    return (
			<div className="login-container">
         <ul className="login-nav">
           <li className="login-nav__item active">
             <NavLink to="/news">登录</NavLink>
           </li>
           <li className="login-nav__item">
             <NavLink to='/signUp'>注册</NavLink>
           </li>
        </ul>
           <label htmlFor="login-input-user" className="login__label">
           用户名
         </label>
         <Input value={this.state.username} placeholder="请输入用户名" />

         <label htmlFor="login-input-password" className="login__label">
           密码
         </label>
         <Input value={this.state.passwd} placeholder="请输入密码" type="password" />

        <Checkbox v-model="checked" className="login__label--checkbox" defaultChecked
          style={{
            '--icon-size': '18px',
            '--font-size': '14px',
            '--gap': '6px',
          }}>记住我</Checkbox>

        <button className="login__submit"
          onClick={()=> this.login()}>登录</button>

          {/*<a href="#" className="login__forgot">忘记密码?</a>*/}
      </div>
		)
	}
}

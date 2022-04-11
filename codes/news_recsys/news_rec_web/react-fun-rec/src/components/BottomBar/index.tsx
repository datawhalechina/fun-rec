import React from 'react'
import {
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { NavBar, TabBar } from 'antd-mobile'

import {
  AppOutline,
  UserOutline,
} from 'antd-mobile-icons'

import  './index.scss'

const BottomBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value: string) => {
    navigate(value, { replace: true }) 
  }

  const tabs = [
    {
      key: '/recLists',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/mySelf',
      title: '我的',
      icon: <UserOutline />
    },
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)} safeArea>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

export default () => {
  return (
    <div className='bottom'>
      <BottomBar />
    </div>
  )
}
import { NewsInfo } from '../assets/type'
import store from '../redux/store'

let Mock = require('mockjs')

// 登录
Mock.mock('/login', 'post', (req: { body: string }) => {
  const { username, passwd } = JSON.parse(req.body)
  // 用户名默认为user 密码默认为pass 
  // 密码由前端加密后转换为h
  if (username === 'user' && passwd === 'h') {
    return {
      code:200
    }
  } else if(username !== 'user'){
    return {
      code:502
    }
  }else if(passwd !== 'h'){
    return {
      code:501
    }
  } else {
    return {
      code:500
    }
  }
})

// 注册
Mock.mock('/register', 'post', (req: { body: string }) => {
  const { username } = JSON.parse(req.body)
  if (username === 'user') {
    return {
      code:500
    }
  } else if(username !== ''){
    return {
      code:200
    }
  }
})


let Data: NewsInfo[] = []
for(let i = 0; i < 10; i ++){
  Data.push({
    cate:Mock.Random.cword(2),
    // news_id:Mock.Random.string('number', 9),
    news_id: Number(Mock.mock('@id')),
    title:Mock.Random.ctitle(5,12),
    content:Mock.Random.cparagraph(3)+'责任编辑'+Mock.Random.cname(),
    ctime:Mock.Random.date('yyyy-MM-dd'),
    read_num:Mock.Random.natural(100, 1000),
    likes:Mock.Random.natural(1, 100),
    collections:Mock.Random.natural(1, 100),
  })
}
Mock.mock('/recList', 'get', () => {
    return {
        code:200,
        data:Data
    }
  })


Mock.mock('/hotList', 'get', () => {
    return {
        code:200,
        data:Data
    }
})

Mock.mock(RegExp("/newsInfo" + ".*"), 'get', (option: { url: string }) => {
  var res,
  id = Number(option.url.split(/news_id?=/)[1].split(/&user_name=/)[0]),
  // data = (store.state.recList.length > store.state.hotList.length) ? store.state.recList : store.state.hotList
  data = store.getState().pushRecLists
  for(let i=0; i< data.length; i++){
    if (id === data[i].news_id) {
      res = data[i]
    }
  }
  
  return {
    status:200,
    data:{
      cate:res.cate,
      news_id:res.news_id,
      title:res.title,
      content:res.content,
      ctime:res.ctime,
      read_num:res.read_num,
      likes:res.likes,
      collections:res.collections,
    }
  }
})

Mock.mock('/action', 'post', () => {
  return {
    status:200,
  }
})

export { }
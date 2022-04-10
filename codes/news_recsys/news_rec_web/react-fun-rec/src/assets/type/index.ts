// redux存的用户信息
export interface userLogState {
  type: string,
  data: {
    username: string,
    passwd: string,
    passwd2?: string,
    age?: string,
    area?: string,
    gender?: string,
    remember?: boolean
  }

}

// 用户登录的信息
export interface UserSignIn {
  name: string
  passwd: string
  remember: boolean
}

// 用户注册的信息
export interface UserSignUp {
  name: string
  passwd: string
  passwd2: string
  age: string
  gender: string
  area: string
}

// 从列表页进入内容页传入的params类型
export interface ToListInfo {
  id: number
  cate: string
}

// 列表页的展示数据
export interface Lists {
  news_id: number
  cate: string
  title: string
  ctime: string
  read_num: number
  likes: number
  collections: number
}

// 新闻详情页的数据
export interface NewsInfo {
  cate: string
  news_id: number
  title: string
  content: string
  ctime: string
  read_num: number
  likes: number
  collections: number
}

// 路由
export interface Router {
  name ?: string,
  path: string,
  auth: boolean,
  children ?: Array < Router >,
  component: any
}
import { REC_LIST, HOT_LIST, READ, LIKE_DECREASE,LIKE_INCREASE,COLLECT_DECREASE,COLLECT_INCREASE, CLEAR_INFO} from './types/constant'

// 用户登录（注册）时传入信息
export const userLog = (type: string, data: object) => ({ type, data })

// 给列表赋值
export const pushRecLists = (data: any) => ({ type:REC_LIST, data })
export const pushHotLists = (data: any) => ({ type: HOT_LIST, data })

// 清空列表 在刷新时调用 重新给列表赋值
export const clearRecLists = () => ({ type: REC_LIST })
export const clearHotLists = () => ({ type: HOT_LIST })

// 退出登录时清空用户相关数据
export const clearUser = (data: Array<object>) => ({ type: CLEAR_INFO, data })

//点进新闻详情页时触发，让阅读次数增加
export const readChange = (data:{lists:Array<object>,id:number}) => ({ type: READ, data })

//点击喜欢或者收藏时触发，让相应次数增加或者减少
export const likesDecrease = (data: { lists: Array<object>, id: number }) => ({ type: LIKE_DECREASE, data })
export const likesIncrease = (data: { lists: Array<object>, id: number }) => ({ type: LIKE_INCREASE, data })

export const collectionsDecrease = (data: { lists: Array<object>, id: number }) => ({ type: COLLECT_DECREASE, data })
export const collectionsIncrease = (data: { lists: Array<object>, id: number }) => ({ type: COLLECT_INCREASE, data })


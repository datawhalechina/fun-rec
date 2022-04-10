//引入createStore，专门用于创建redux中最为核心的store对象
import {createStore,applyMiddleware} from 'redux'
//引入汇总之后的reducer
import  rootReducer  from './reducers'
//引入redux-thunk，用于支持异步action
import thunk from 'redux-thunk'
//引入redux-devtools-extension
import { composeWithDevTools } from 'redux-devtools-extension'
// 引入redux-persist插件，使用sessionstorage持久化数据，解决页面刷新数据丢失的问题
import { persistStore, persistReducer } from 'redux-persist';
// 存储机制,当前使用sessionStorage
import storageSession from 'redux-persist/lib/storage/session'

const storageConfig = {
  key: 'root', // 必须
  storage: storageSession, // 缓存机制
}

const myPersistReducer = persistReducer(storageConfig, rootReducer);
const store = createStore(myPersistReducer, composeWithDevTools(applyMiddleware(thunk)));

// 使用ts的条件类型 ReturnType<T>，T:函数类型。 获取函数返回值的类型 
export type RootState = ReturnType<typeof store.getState>

export const persistor = persistStore(store)
export default store;
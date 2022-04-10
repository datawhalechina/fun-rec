//引入combineReducers，用于汇总多个reducer
import { combineReducers } from 'redux'

import {userLog} from './reducers/userLog'
import { pushRecLists, pushHotLists } from './reducers/pushLists'
import { readChange, likesChange, collectionsChange } from './reducers/numChange'

//汇总所有的reducer变为一个总的reducer
export default combineReducers({
  userLog,
  pushRecLists, pushHotLists,
  readChange, likesChange, collectionsChange
})

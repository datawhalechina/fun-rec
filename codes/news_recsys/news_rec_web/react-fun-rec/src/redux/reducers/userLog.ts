import { userLogState } from '../../assets/type'
import { CLEAR_INFO, SIGNIN, SIGNUP } from '../types/constant'


const userLogDefault: userLogState = {
  type: SIGNIN,
  data: {
    username: '',
    passwd: '',
  }
}
export function userLog(preState = userLogDefault, action: userLogState) {
  switch(action.type) {
    case SIGNIN:
      return ({ type: action.type, data: action.data })
    case SIGNUP:
      return ({ type: action.type, data: action.data })
    case CLEAR_INFO:
      return ({ type: action.type, data: action.data })
    default: 
      return preState
  } 
}
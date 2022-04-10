import { HOT_LIST, REC_LIST } from '../types/constant'

export function pushRecLists(preState = [], action: { type: string; data: any }) {
  switch (action.type){
    case REC_LIST:
      return action.data
    default:
      return preState
  }
}

export function pushHotLists(preState = [], action: { type: string; data: any }) {
  switch (action.type){
    case HOT_LIST:
      return action.data
    default:
      return preState
  }
}
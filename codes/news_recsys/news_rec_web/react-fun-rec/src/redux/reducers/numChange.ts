import { Lists } from '../../assets/type'
import { READ, LIKE_DECREASE, LIKE_INCREASE, COLLECT_DECREASE, COLLECT_INCREASE } from '../types/constant'

const readDefault = 0
export function readChange(preState = readDefault, action: { type: string, data: {lists:Array<Lists>,id:number} }) {
  switch (action.type){
    case READ:
      return action.data.lists.map((item) => {
        if (item.news_id !== action.data.id) {
          return action.data.lists
        }

        item.read_num++
        return {
          ...item,
          ...action.data.lists
        }
      })
    default:
      return preState
  }
}

const likesDefault = 0
export function likesChange(preState = likesDefault, action: { type: string; data: { lists: Array<Lists>, id: number } }) {
  switch (action.type) {
    case LIKE_DECREASE:
      return action.data.lists.map((item) => {
        if (item.news_id !== action.data.id) {
          return action.data.lists
        } else {
          item.likes--
          return {
            ...item,
            ...action.data.lists
          }
        }
      })
    case LIKE_INCREASE:
      return action.data.lists.map((item) => {
        if (item.news_id !== action.data.id) {
          return action.data.lists
        } else {
          item.likes ++
          return {
            ...item,
            ...action.data.lists
          }
        }
      })
    default:
      return preState
  }
}

const colllectionsDefault = 0
export function collectionsChange(preState = colllectionsDefault, action: { type: string; data: { lists: Array<Lists>, id: number } }) {
  switch (action.type) {
    case COLLECT_DECREASE:
      return action.data.lists.map((item) => {
        if (item.news_id !== action.data.id) {
          return action.data.lists
        } else {
          item.collections--
          return {
            ...item,
            ...action.data.lists
          }
        }
      })
    case COLLECT_INCREASE:
      return action.data.lists.map((item) => {
        if (item.news_id !== action.data.id) {
          return action.data.lists
        } else {
          item.collections++
          return {
            ...item,
            ...action.data.lists
          }
        }
      })
    default:
      return preState
  }
}
// 使用TypeUseSelectorHook这个interface 来重新定义 useSelector这个hook
import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux'
import { RootState } from '../store'

export const useSelector:TypedUseSelectorHook<RootState> = useReduxSelector



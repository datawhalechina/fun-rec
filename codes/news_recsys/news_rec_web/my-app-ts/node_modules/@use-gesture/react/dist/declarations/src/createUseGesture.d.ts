import { Action, GestureHandlers, UserGestureConfig } from '@use-gesture/core/types';
export declare function createUseGesture(actions: Action[]): <Config extends UserGestureConfig = UserGestureConfig>(_handlers: GestureHandlers, _config?: {} | Config) => Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

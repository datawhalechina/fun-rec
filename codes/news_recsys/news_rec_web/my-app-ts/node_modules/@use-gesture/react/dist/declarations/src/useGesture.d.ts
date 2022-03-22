import { GestureHandlers, UserGestureConfig, EventTypes, AnyHandlerEventTypes } from '@use-gesture/core/types';
/**
 * @public
 *
 * The most complete gesture hook, allowing support for multiple gestures.
 *
 * @param {GestureHandlers} handlers - an object with on[Gesture] keys containg gesture handlers
 * @param {UseGestureConfig} [config={}] - the full config object
 */
export declare function useGesture<HandlerTypes extends AnyHandlerEventTypes = EventTypes, Config extends UserGestureConfig = UserGestureConfig>(handlers: GestureHandlers<HandlerTypes>, config?: Config | {}): Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

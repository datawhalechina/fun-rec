import { UserPinchConfig, Handler, EventTypes } from '@use-gesture/core/types';
/**
 * Pinch hook.
 *
 * @param {Handler<'pinch'>} handler - the function fired every time the pinch gesture updates
 * @param {UserPinchConfig} [config={}] - the config object including generic options and pinch options
 */
export declare function usePinch<EventType = EventTypes['pinch'], Config extends UserPinchConfig = UserPinchConfig>(handler: Handler<'pinch', EventType>, config?: Config | {}): Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

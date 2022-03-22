import { UserWheelConfig, Handler, EventTypes } from '@use-gesture/core/types';
/**
 * Wheel hook.
 *
 * @param {Handler<'wheel'>} handler - the function fired every time the wheel gesture updates
 * @param {UserWheelConfig} [config={}] - the config object including generic options and wheel options
 */
export declare function useWheel<EventType = EventTypes['wheel'], Config extends UserWheelConfig = UserWheelConfig>(handler: Handler<'wheel', EventType>, config?: Config | {}): Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

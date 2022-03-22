import { EventTypes, UserHoverConfig, Handler } from '@use-gesture/core/types';
/**
 * Hover hook.
 *
 * @param {Handler<'hover'>} handler - the function fired every time the hover gesture updates
 * @param {UserHoverConfig} [config={}] - the config object including generic options and hover options
 */
export declare function useHover<EventType = EventTypes['hover'], Config extends UserHoverConfig = UserHoverConfig>(handler: Handler<'hover', EventType>, config?: Config | {}): Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

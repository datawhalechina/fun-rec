import { UserScrollConfig, Handler, EventTypes } from '@use-gesture/core/types';
/**
 * Scroll hook.
 *
 * @param {Handler<'scroll'>} handler - the function fired every time the scroll gesture updates
 * @param {UserScrollConfig} [config={}] - the config object including generic options and scroll options
 */
export declare function useScroll<EventType = EventTypes['scroll'], Config extends UserScrollConfig = UserScrollConfig>(handler: Handler<'scroll', EventType>, config?: Config | {}): Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

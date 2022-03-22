import { EventTypes, Handler, UserDragConfig } from '@use-gesture/core/types';
/**
 * Drag hook.
 *
 * @param {Handler<'drag'>} handler - the function fired every time the drag gesture updates
 * @param {UserDragConfig} [config={}] - the config object including generic options and drag options
 */
export declare function useDrag<EventType = EventTypes['drag'], Config extends UserDragConfig = UserDragConfig>(handler: Handler<'drag', EventType>, config?: Config | {}): Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

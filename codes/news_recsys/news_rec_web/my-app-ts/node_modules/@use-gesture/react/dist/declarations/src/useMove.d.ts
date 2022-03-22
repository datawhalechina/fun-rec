import { UserMoveConfig, Handler, EventTypes } from '@use-gesture/core/types';
/**
 * Move hook.
 *
 * @param {Handler<'move'>} handler - the function fired every time the move gesture updates
 * @param {UserMoveConfig} [config={}] - the config object including generic options and move options
 */
export declare function useMove<EventType = EventTypes['move'], Config extends UserMoveConfig = UserMoveConfig>(handler: Handler<'move', EventType>, config?: Config | {}): Config["target"] extends object ? void : (...args: any[]) => import("@use-gesture/core/types").ReactDOMAttributes;

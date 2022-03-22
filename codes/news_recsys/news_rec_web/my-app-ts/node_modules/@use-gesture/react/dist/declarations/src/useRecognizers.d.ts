import { GenericOptions, GestureKey, InternalHandlers, NativeHandlers, ReactDOMAttributes } from '@use-gesture/core/types';
declare type HookReturnType<Config extends GenericOptions> = Config['target'] extends object ? void : (...args: any[]) => ReactDOMAttributes;
/**
 * Utility hook called by all gesture hooks and that will be responsible for
 * the internals.
 *
 * @param {InternalHandlers} handlers
 * @param {GenericOptions} config
 * @param {GestureKey} gestureKey
 * @param {NativeHandler} nativeHandlers
 * @returns nothing when config.target is set, a binding function when not.
 */
export declare function useRecognizers<Config extends GenericOptions>(handlers: InternalHandlers, config?: Config | {}, gestureKey?: GestureKey, nativeHandlers?: NativeHandlers): HookReturnType<Config>;
export {};

import { EventStore } from './EventStore';
import { TimeoutStore } from './TimeoutStore';
import { GestureKey, InternalConfig, InternalHandlers, NativeHandlers, State, UserGestureConfig } from './types';
export declare class Controller {
    /**
     * The list of gestures handled by the Controller.
     */
    gestures: Set<GestureKey>;
    /**
     * The event store that keeps track of the config.target listeners.
     */
    private _targetEventStore;
    /**
     * Object that keeps track of all gesture event listeners.
     */
    gestureEventStores: {
        [key in GestureKey]?: EventStore;
    };
    gestureTimeoutStores: {
        [key in GestureKey]?: TimeoutStore;
    };
    handlers: InternalHandlers;
    private nativeHandlers?;
    config: InternalConfig;
    pointerIds: Set<number>;
    touchIds: Set<number>;
    state: State;
    constructor(handlers: InternalHandlers);
    /**
     * Sets pointer or touch ids based on the event.
     * @param event
     */
    setEventIds(event: TouchEvent | PointerEvent): void;
    /**
     * Attaches handlers to the controller.
     * @param handlers
     * @param nativeHandlers
     */
    applyHandlers(handlers: InternalHandlers, nativeHandlers?: NativeHandlers): void;
    /**
     * Compute and attaches a config to the controller.
     * @param config
     * @param gestureKey
     */
    applyConfig(config: UserGestureConfig, gestureKey?: GestureKey): void;
    /**
     * Cleans all side effects (listeners, timeouts). When the gesture is
     * destroyed (in React, when the component is unmounted.)
     */
    clean(): void;
    /**
     * Executes side effects (attaching listeneds to a `config.target`). Ran on
     * each render.
     */
    effect(): () => void;
    /**
     * The bind function that can be returned by the gesture handler (a hook in
     * React for example.)
     * @param args
     */
    bind(...args: any[]): any;
}

import { Controller } from '../Controller';
import { GestureKey, IngKey, State, Vector2 } from '../types';
export interface Engine<Key extends GestureKey> {
    /**
     * Function that some gestures can use to add initilization
     * properties to the state when it is created.
     */
    init?(): void;
    /**
     * Setup function that some gestures can use to set additional properties of
     * the state when the gesture starts.
     */
    setup?(): void;
    /**
     * Function used by some gestures to determine the intentionality of a
     * a movement depending on thresholds. The intent function can change the
     * `state._active` or `state._blocked` flags if the gesture isn't intentional.
     * @param movement
     */
    intent?(movement: Vector2): void;
}
export declare abstract class Engine<Key extends GestureKey> {
    /**
     * The Controller handling state.
     */
    ctrl: Controller;
    /**
     * The gesture key ('drag' | 'pinch' | 'wheel' | 'scroll' | 'move' | 'hover')
     */
    readonly key: Key;
    /**
     * The key representing the active state of the gesture in the shared state.
     * ('dragging' | 'pinching' | 'wheeling' | 'scrolling' | 'moving' | 'hovering')
     */
    abstract readonly ingKey: IngKey;
    /**
     * The arguments passed to the `bind` function.
     */
    /**
     * State prop that aliases state values (`xy` or `da`).
     */
    abstract readonly aliasKey: string;
    args: any[];
    constructor(ctrl: Controller, args: any[], key: Key);
    /**
     * Function implemented by gestures that compute the offset from the state
     * movement.
     */
    abstract computeOffset(): void;
    /**
     * Function implemented by the gestures that compute the movement from the
     * corrected offset (after bounds and potential rubberbanding).
     */
    abstract computeMovement(): void;
    /**
     * Executes the bind function so that listeners are properly set by the
     * Controller.
     * @param bindFunction
     */
    abstract bind(bindFunction: (device: string, action: string, handler: (event: any) => void, options?: AddEventListenerOptions) => void): void;
    /**
     * Shortcut to the gesture state read from the Controller.
     */
    get state(): NonNullable<State[Key]>;
    set state(state: NonNullable<State[Key]>);
    /**
     * Shortcut to the shared state read from the Controller
     */
    get shared(): import("../types").SharedGestureState;
    /**
     * Shortcut to the gesture event store read from the Controller.
     */
    get eventStore(): NonNullable<{
        drag?: import("../EventStore").EventStore | undefined;
        wheel?: import("../EventStore").EventStore | undefined;
        scroll?: import("../EventStore").EventStore | undefined;
        move?: import("../EventStore").EventStore | undefined;
        hover?: import("../EventStore").EventStore | undefined;
        pinch?: import("../EventStore").EventStore | undefined;
    }[Key]>;
    /**
     * Shortcut to the gesture timeout store read from the Controller.
     */
    get timeoutStore(): NonNullable<{
        drag?: import("../TimeoutStore").TimeoutStore | undefined;
        wheel?: import("../TimeoutStore").TimeoutStore | undefined;
        scroll?: import("../TimeoutStore").TimeoutStore | undefined;
        move?: import("../TimeoutStore").TimeoutStore | undefined;
        hover?: import("../TimeoutStore").TimeoutStore | undefined;
        pinch?: import("../TimeoutStore").TimeoutStore | undefined;
    }[Key]>;
    /**
     * Shortcut to the gesture config read from the Controller.
     */
    get config(): NonNullable<import("../types").InternalConfig[Key]>;
    /**
     * Shortcut to the shared config read from the Controller.
     */
    get sharedConfig(): import("../types").InternalGenericOptions;
    /**
     * Shortcut to the gesture handler read from the Controller.
     */
    get handler(): NonNullable<import("../types").InternalHandlers[Key]>;
    reset(): void;
    /**
     * Function ran at the start of the gesture.
     * @param event
     */
    start(event: NonNullable<State[Key]>['event']): void;
    /**
     * Assign raw values to `state._values` and transformed values to
     * `state.values`.
     * @param values
     */
    computeValues(values: Vector2): void;
    /**
     * Assign `state._values` to `state._initial` and transformed `state.values` to
     * `state.initial`.
     * @param values
     */
    computeInitial(): void;
    /**
     * Computes all sorts of state attributes, including kinematics.
     * @param event
     */
    compute(event?: NonNullable<State[Key]>['event']): void;
    /**
     * Fires the gesture handler.
     */
    emit(): void;
    /**
     * Cleans the gesture timeouts and event listeners.
     */
    clean(): void;
}

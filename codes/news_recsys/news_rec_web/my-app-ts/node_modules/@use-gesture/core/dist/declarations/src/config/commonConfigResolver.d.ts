import { InternalGestureOptions } from '../types';
import { Vector2, State, GenericOptions } from '../types';
export declare const identity: (v: Vector2) => Vector2;
export declare const DEFAULT_RUBBERBAND = 0.15;
export declare const commonConfigResolver: {
    enabled(value?: boolean): boolean;
    preventDefault(value?: boolean): boolean;
    triggerAllEvents(value?: boolean): boolean;
    rubberband(value?: number | boolean | Vector2): Vector2;
    from(value: number | Vector2 | ((s: State) => Vector2)): [number, number] | ((s: State) => Vector2) | undefined;
    transform(this: InternalGestureOptions, value: any, _k: string, config: {
        shared: GenericOptions;
    }): any;
    threshold(value: any): [any, any];
};

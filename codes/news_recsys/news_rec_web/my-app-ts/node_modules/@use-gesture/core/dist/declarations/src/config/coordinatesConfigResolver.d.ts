import { InternalCoordinatesOptions, CoordinatesConfig, DragBounds, State, Vector2 } from '../types';
export declare const coordinatesConfigResolver: {
    axis(this: InternalCoordinatesOptions, _v: any, _k: string, { axis }: CoordinatesConfig): InternalCoordinatesOptions['axis'];
    bounds(value?: DragBounds | ((state: State) => DragBounds)): (() => EventTarget | null) | HTMLElement | [Vector2, Vector2];
    enabled(value?: boolean): boolean;
    preventDefault(value?: boolean): boolean;
    triggerAllEvents(value?: boolean): boolean;
    rubberband(value?: number | boolean | Vector2): Vector2;
    from(value: number | Vector2 | ((s: State) => Vector2)): [number, number] | ((s: State) => Vector2) | undefined;
    transform(this: import("../types").InternalGestureOptions<import("../types").GestureKey>, value: any, _k: string, config: {
        shared: import("../types").GenericOptions;
    }): any;
    threshold(value: any): [any, any];
};

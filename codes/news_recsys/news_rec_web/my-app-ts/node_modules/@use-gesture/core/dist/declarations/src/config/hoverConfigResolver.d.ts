export declare const hoverConfigResolver: {
    mouseOnly: (value?: boolean) => boolean;
    axis(this: import("../types").InternalCoordinatesOptions<import("../types").CoordinatesKey>, _v: any, _k: string, { axis }: import("../types").CoordinatesConfig<import("../types").CoordinatesKey>): "x" | "y" | undefined;
    bounds(value?: import("../types").DragBounds | ((state: import("../types").State) => import("../types").DragBounds)): HTMLElement | [import("../types").Vector2, import("../types").Vector2] | (() => EventTarget | null);
    enabled(value?: boolean): boolean;
    preventDefault(value?: boolean): boolean;
    triggerAllEvents(value?: boolean): boolean;
    rubberband(value?: number | boolean | import("../types").Vector2): import("../types").Vector2;
    from(value: number | import("../types").Vector2 | ((s: import("../types").State) => import("../types").Vector2)): [number, number] | ((s: import("../types").State) => import("../types").Vector2) | undefined;
    transform(this: import("../types").InternalGestureOptions<import("../types").GestureKey>, value: any, _k: string, config: {
        shared: import("../types").GenericOptions;
    }): any;
    threshold(value: any): [any, any];
};

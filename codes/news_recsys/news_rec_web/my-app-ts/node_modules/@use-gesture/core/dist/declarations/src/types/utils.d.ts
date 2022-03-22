/// <reference types="react" />
export declare type Vector2 = [number, number];
export declare type WebKitGestureEvent = PointerEvent & {
    scale: number;
    rotation: number;
};
export declare type Target = EventTarget | React.RefObject<EventTarget>;

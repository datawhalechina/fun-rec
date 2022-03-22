import { Engine } from './Engine';
import { Vector2, WebKitGestureEvent } from '../types';
export declare class PinchEngine extends Engine<'pinch'> {
    ingKey: "pinching";
    aliasKey: string;
    init(): void;
    reset(): void;
    computeOffset(): void;
    computeMovement(): void;
    intent(v: Vector2): void;
    cancel(): void;
    touchStart(event: TouchEvent): void;
    pointerStart(event: PointerEvent): void;
    pinchStart(event: PointerEvent | TouchEvent, payload: {
        distance: number;
        angle: number;
        origin: Vector2;
    }): void;
    touchMove(event: TouchEvent): void;
    pointerMove(event: PointerEvent): void;
    pinchMove(event: PointerEvent | TouchEvent, payload: {
        distance: number;
        angle: number;
        origin: Vector2;
    }): void;
    touchEnd(event: TouchEvent): void;
    pointerEnd(event: PointerEvent): void;
    gestureStart(event: WebKitGestureEvent): void;
    gestureMove(event: WebKitGestureEvent): void;
    gestureEnd(event: WebKitGestureEvent): void;
    wheel(event: WheelEvent): void;
    wheelStart(event: WheelEvent): void;
    wheelChange(event: WheelEvent): void;
    wheelEnd(): void;
    bind(bindFunction: any): void;
}

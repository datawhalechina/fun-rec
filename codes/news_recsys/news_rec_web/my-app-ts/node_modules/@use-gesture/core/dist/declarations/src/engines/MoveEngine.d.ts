import { CoordinatesEngine } from './CoordinatesEngine';
export declare class MoveEngine extends CoordinatesEngine<'move'> {
    ingKey: "moving";
    move(event: PointerEvent): void;
    moveStart(event: PointerEvent): void;
    moveChange(event: PointerEvent): void;
    moveEnd(event?: PointerEvent): void;
    bind(bindFunction: any): void;
}

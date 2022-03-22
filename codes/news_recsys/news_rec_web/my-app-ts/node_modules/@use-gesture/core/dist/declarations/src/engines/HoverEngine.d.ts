import { CoordinatesEngine } from './CoordinatesEngine';
export declare class HoverEngine extends CoordinatesEngine<'hover'> {
    ingKey: "hovering";
    enter(event: PointerEvent): void;
    leave(event: PointerEvent): void;
    bind(bindFunction: any): void;
}

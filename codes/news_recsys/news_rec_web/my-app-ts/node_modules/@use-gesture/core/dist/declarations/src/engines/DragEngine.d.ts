import { CoordinatesEngine } from './CoordinatesEngine';
export declare class DragEngine extends CoordinatesEngine<'drag'> {
    ingKey: "dragging";
    reset(this: DragEngine): void;
    setup(): void;
    cancel(): void;
    setActive(): void;
    clean(): void;
    pointerDown(event: PointerEvent): void;
    startPointerDrag(event: PointerEvent): void;
    pointerMove(event: PointerEvent): void;
    pointerUp(event: PointerEvent): void;
    pointerClick(event: MouseEvent): void;
    setupPointer(event: PointerEvent): void;
    pointerClean(): void;
    preventScroll(event: PointerEvent): void;
    setupScrollPrevention(event: PointerEvent): void;
    setupDelayTrigger(event: PointerEvent): void;
    keyDown(event: KeyboardEvent): void;
    keyUp(event: KeyboardEvent): void;
    bind(bindFunction: any): void;
}

import type { BasicTarget } from '../utils/domTarget';
declare type EventType = MouseEvent | TouchEvent;
export interface Options {
    delay?: number;
    onClick?: (event: EventType) => void;
    onLongPressEnd?: (event: EventType) => void;
}
declare function useLongPress(onLongPress: (event: EventType) => void, target: BasicTarget, { delay, onClick, onLongPressEnd }?: Options): void;
export default useLongPress;

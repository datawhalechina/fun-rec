import { PointerOptions } from './utils';
export declare interface clickOptions {
    skipHover?: boolean;
    clickCount?: number;
}
declare function click(element: Element, init?: MouseEventInit, { skipHover, clickCount, skipPointerEventsCheck, }?: clickOptions & PointerOptions): void;
declare function dblClick(element: Element, init?: MouseEventInit, { skipPointerEventsCheck }?: clickOptions & PointerOptions): void;
export { click, dblClick };

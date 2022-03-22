import { PointerOptions } from './utils';
declare function hover(element: Element, init?: MouseEventInit, { skipPointerEventsCheck }?: PointerOptions): void;
declare function unhover(element: Element, init?: MouseEventInit, { skipPointerEventsCheck }?: PointerOptions): void;
export { hover, unhover };

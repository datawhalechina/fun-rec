import type { MutableRefObject } from 'react';
declare type TargetValue<T> = T | undefined | null;
declare type TargetType = HTMLElement | Element | Window | Document;
export declare type BasicTarget<T extends TargetType = Element> = (() => TargetValue<T>) | TargetValue<T> | MutableRefObject<TargetValue<T>>;
export declare function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T): TargetValue<T>;
export {};

import { RefObject } from 'react';
export declare function useResizeEffect<T extends HTMLElement>(effect: (target: T) => void, targetRef: RefObject<T>): void;

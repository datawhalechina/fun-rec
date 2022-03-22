import type { BasicTarget } from '../utils/domTarget';
declare type noop = (...p: any) => void;
export declare type Target = BasicTarget<HTMLElement | Element | Window | Document>;
declare type Options<T extends Target = Target> = {
    target?: T;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
};
declare function useEventListener<K extends keyof HTMLElementEventMap>(eventName: K, handler: (ev: HTMLElementEventMap[K]) => void, options?: Options<HTMLElement>): void;
declare function useEventListener<K extends keyof ElementEventMap>(eventName: K, handler: (ev: ElementEventMap[K]) => void, options?: Options<Element>): void;
declare function useEventListener<K extends keyof DocumentEventMap>(eventName: K, handler: (ev: DocumentEventMap[K]) => void, options?: Options<Document>): void;
declare function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (ev: WindowEventMap[K]) => void, options?: Options<Window>): void;
declare function useEventListener(eventName: string, handler: noop, options: Options): void;
export default useEventListener;

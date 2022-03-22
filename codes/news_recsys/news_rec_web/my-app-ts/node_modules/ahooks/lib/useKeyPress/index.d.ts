import type { BasicTarget } from '../utils/domTarget';
export declare type KeyPredicate = (event: KeyboardEvent) => boolean;
export declare type keyType = number | string;
export declare type KeyFilter = keyType | keyType[] | ((event: KeyboardEvent) => boolean);
export declare type EventHandler = (event: KeyboardEvent) => void;
export declare type KeyEvent = 'keydown' | 'keyup';
export declare type Target = BasicTarget<HTMLElement | Document | Window>;
export declare type Options = {
    events?: KeyEvent[];
    target?: Target;
    exactMatch?: boolean;
};
declare function useKeyPress(keyFilter: KeyFilter, eventHandler: EventHandler, option?: Options): void;
export default useKeyPress;

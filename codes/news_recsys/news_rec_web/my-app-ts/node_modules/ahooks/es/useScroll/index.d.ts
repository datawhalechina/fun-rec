import type { BasicTarget } from '../utils/domTarget';
declare type Position = {
    left: number;
    top: number;
};
export declare type Target = BasicTarget<Element | Document>;
export declare type ScrollListenController = (val: Position) => boolean;
declare function useScroll(target?: Target, shouldUpdate?: ScrollListenController): Position | undefined;
export default useScroll;

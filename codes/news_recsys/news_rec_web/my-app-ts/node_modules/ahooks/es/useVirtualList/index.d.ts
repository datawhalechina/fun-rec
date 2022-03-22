import type { BasicTarget } from '../utils/domTarget';
export interface Options<T> {
    containerTarget: BasicTarget;
    wrapperTarget: BasicTarget;
    itemHeight: number | ((index: number, data: T) => number);
    overscan?: number;
}
declare const useVirtualList: <T = any>(list: T[], options: Options<T>) => readonly [{
    index: number;
    data: T;
}[], (this: unknown, index: number) => void];
export default useVirtualList;

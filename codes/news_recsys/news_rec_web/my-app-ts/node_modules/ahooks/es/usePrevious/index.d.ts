export declare type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;
declare function usePrevious<T>(state: T, shouldUpdate?: ShouldUpdateFunc<T>): T | undefined;
export default usePrevious;

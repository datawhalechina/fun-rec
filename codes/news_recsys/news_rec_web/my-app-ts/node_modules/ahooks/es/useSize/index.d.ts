import type { BasicTarget } from '../utils/domTarget';
declare type Size = {
    width: number;
    height: number;
};
declare function useSize(target: BasicTarget): Size | undefined;
export default useSize;

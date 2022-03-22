import 'intersection-observer';
import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    rootMargin?: string;
    threshold?: number | number[];
    root?: BasicTarget<Element>;
}
declare function useInViewport(target: BasicTarget, options?: Options): readonly [boolean | undefined, number | undefined];
export default useInViewport;

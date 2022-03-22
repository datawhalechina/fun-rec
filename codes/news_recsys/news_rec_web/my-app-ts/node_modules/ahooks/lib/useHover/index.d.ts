import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onEnter?: () => void;
    onLeave?: () => void;
}
declare const _default: (target: BasicTarget, options?: Options | undefined) => boolean;
export default _default;

import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onExit?: () => void;
    onEnter?: () => void;
}
declare const useFullscreen: (target: BasicTarget, options?: Options | undefined) => readonly [boolean, {
    readonly enterFullscreen: (this: unknown) => void;
    readonly exitFullscreen: (this: unknown) => void;
    readonly toggleFullscreen: (this: unknown) => void;
    readonly isEnabled: true;
}];
export default useFullscreen;

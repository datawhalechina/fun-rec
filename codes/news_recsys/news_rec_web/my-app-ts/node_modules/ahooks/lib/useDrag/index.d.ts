/// <reference types="react" />
import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onDragStart?: (event: React.DragEvent) => void;
    onDragEnd?: (event: React.DragEvent) => void;
}
declare const useDrag: <T>(data: T, target: BasicTarget, options?: Options) => void;
export default useDrag;

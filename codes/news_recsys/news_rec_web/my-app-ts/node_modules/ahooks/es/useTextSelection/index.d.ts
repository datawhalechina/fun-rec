import type { BasicTarget } from '../utils/domTarget';
interface Rect {
    top: number;
    left: number;
    bottom: number;
    right: number;
    height: number;
    width: number;
}
export interface State extends Rect {
    text: string;
}
declare function useTextSelection(target?: BasicTarget<Document | Element>): State;
export default useTextSelection;

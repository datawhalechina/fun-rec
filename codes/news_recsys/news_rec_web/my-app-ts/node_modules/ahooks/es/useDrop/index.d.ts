/// <reference types="react" />
import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onFiles?: (files: File[], event?: React.DragEvent) => void;
    onUri?: (url: string, event?: React.DragEvent) => void;
    onDom?: (content: any, event?: React.DragEvent) => void;
    onText?: (text: string, event?: React.ClipboardEvent) => void;
    onDragEnter?: (event?: React.DragEvent) => void;
    onDragOver?: (event?: React.DragEvent) => void;
    onDragLeave?: (event?: React.DragEvent) => void;
    onDrop?: (event?: React.DragEvent) => void;
    onPaste?: (event?: React.ClipboardEvent) => void;
}
declare const useDrop: (target: BasicTarget, options?: Options) => void;
export default useDrop;

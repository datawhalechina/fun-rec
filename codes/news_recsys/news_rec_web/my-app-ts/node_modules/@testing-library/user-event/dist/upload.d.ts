interface uploadInit {
    clickInit?: MouseEventInit;
    changeInit?: EventInit;
}
interface uploadOptions {
    applyAccept?: boolean;
}
declare function upload(element: HTMLElement, fileOrFiles: File | File[], init?: uploadInit, { applyAccept }?: uploadOptions): void;
export { upload };

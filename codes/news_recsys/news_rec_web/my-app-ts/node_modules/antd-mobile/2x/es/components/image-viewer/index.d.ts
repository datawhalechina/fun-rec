/// <reference types="react" />
import './image-viewer.less';
import { showMultiImageViewer, showImageViewer, clearImageViewer } from './methods';
export type { ImageViewerProps, MultiImageViewerProps, MultiImageViewerRef, } from './image-viewer';
export type { ImageViewerShowHandler } from './methods';
declare const _default: import("react").FC<import("./image-viewer").ImageViewerProps> & {
    Multi: import("react").ForwardRefExoticComponent<Omit<import("./image-viewer").ImageViewerProps, "image"> & {
        images?: string[] | undefined;
        defaultIndex?: number | undefined;
        onIndexChange?: ((index: number) => void) | undefined;
    } & import("react").RefAttributes<import("./slides").SlidesRef>> & {
        show: typeof showMultiImageViewer;
    };
    show: typeof showImageViewer;
    clear: typeof clearImageViewer;
};
export default _default;

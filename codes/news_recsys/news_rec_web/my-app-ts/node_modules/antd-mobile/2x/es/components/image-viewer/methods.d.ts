import { ImageViewerProps, MultiImageViewerProps } from './image-viewer';
export declare type ImageViewerShowHandler = {
    close: () => void;
};
export declare function showImageViewer(props: Omit<ImageViewerProps, 'visible'>): ImageViewerShowHandler;
export declare function showMultiImageViewer(props: Omit<MultiImageViewerProps, 'visible'>): ImageViewerShowHandler;
export declare function clearImageViewer(): void;

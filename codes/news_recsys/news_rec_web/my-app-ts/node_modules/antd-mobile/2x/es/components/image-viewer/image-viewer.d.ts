import React, { FC } from 'react';
import { GetContainer } from '../../utils/render-to-container';
import { SlidesRef } from './slides';
export declare type ImageViewerProps = {
    image?: string;
    maxZoom?: number;
    getContainer?: GetContainer;
    visible?: boolean;
    onClose?: () => void;
    afterClose?: () => void;
};
export declare const ImageViewer: FC<ImageViewerProps>;
export declare type MultiImageViewerRef = SlidesRef;
export declare type MultiImageViewerProps = Omit<ImageViewerProps, 'image'> & {
    images?: string[];
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
};
export declare const MultiImageViewer: React.ForwardRefExoticComponent<Omit<ImageViewerProps, "image"> & {
    images?: string[] | undefined;
    defaultIndex?: number | undefined;
    onIndexChange?: ((index: number) => void) | undefined;
} & React.RefAttributes<SlidesRef>>;

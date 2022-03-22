import { FC, MutableRefObject } from 'react';
declare type Props = {
    image: string;
    maxZoom: number;
    onTap: () => void;
    onZoomChange?: (zoom: number) => void;
    dragLockRef?: MutableRefObject<boolean>;
};
export declare const Slide: FC<Props>;
export {};

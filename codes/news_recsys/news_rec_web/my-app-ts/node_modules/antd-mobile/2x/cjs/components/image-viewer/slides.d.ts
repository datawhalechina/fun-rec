import React from 'react';
export declare type SlidesType = {
    images: string[];
    onTap: () => void;
    maxZoom: number;
    defaultIndex: number;
    onIndexChange?: (index: number) => void;
};
export declare type SlidesRef = {
    swipeTo: (index: number, immediate?: boolean) => void;
};
export declare const Slides: React.ForwardRefExoticComponent<SlidesType & React.RefAttributes<SlidesRef>>;

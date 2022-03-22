declare type Direction = '' | 'vertical' | 'horizontal';
export declare function useTouch(): {
    move: EventListener;
    start: EventListener;
    reset: () => void;
    startX: import("react").MutableRefObject<number>;
    startY: import("react").MutableRefObject<number>;
    deltaX: import("react").MutableRefObject<number>;
    deltaY: import("react").MutableRefObject<number>;
    offsetX: import("react").MutableRefObject<number>;
    offsetY: import("react").MutableRefObject<number>;
    direction: import("react").MutableRefObject<Direction>;
    isVertical: () => boolean;
    isHorizontal: () => boolean;
};
export {};

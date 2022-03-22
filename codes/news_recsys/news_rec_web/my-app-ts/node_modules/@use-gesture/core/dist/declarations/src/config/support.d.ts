export declare const SUPPORT: {
    isBrowser: false | {
        <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions | undefined): HTMLElementTagNameMap[K];
        <K_1 extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K_1, options?: ElementCreationOptions | undefined): HTMLElementDeprecatedTagNameMap[K_1];
        (tagName: string, options?: ElementCreationOptions | undefined): HTMLElement;
    };
    gesture: boolean;
    /**
     * It looks from https://github.com/pmndrs/use-gesture/discussions/421 that
     * some touchscreens using webkits don't have 'ontouchstart' in window. So
     * we're considering that browsers support TouchEvent if they have
     * `maxTouchPoints > 1`
     */
    touch: boolean;
    touchscreen: boolean;
    pointer: boolean;
    pointerLock: boolean;
};

import { Target } from '../types';
export declare const sharedConfigResolver: {
    target(value: Target): (() => EventTarget | null) | undefined;
    enabled(value?: boolean): boolean;
    window(value?: (Window & typeof globalThis) | undefined): (Window & typeof globalThis) | undefined;
    eventOptions({ passive, capture }?: {
        passive?: boolean | undefined;
        capture?: boolean | undefined;
    }): {
        passive: boolean;
        capture: boolean;
    };
    transform(value: any): any;
};

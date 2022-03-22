export declare const config: {
    readonly default: {
        readonly tension: 170;
        readonly friction: 26;
    };
    readonly gentle: {
        readonly tension: 120;
        readonly friction: 14;
    };
    readonly wobbly: {
        readonly tension: 180;
        readonly friction: 12;
    };
    readonly stiff: {
        readonly tension: 210;
        readonly friction: 20;
    };
    readonly slow: {
        readonly tension: 280;
        readonly friction: 60;
    };
    readonly molasses: {
        readonly tension: 280;
        readonly friction: 120;
    };
};
/**
 * With thanks to ai easings.net
 * https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 */
interface EasingDictionary {
    linear: (t: number) => number;
    easeInQuad: (t: number) => number;
    easeOutQuad: (t: number) => number;
    easeInOutQuad: (t: number) => number;
    easeInCubic: (t: number) => number;
    easeOutCubic: (t: number) => number;
    easeInOutCubic: (t: number) => number;
    easeInQuart: (t: number) => number;
    easeOutQuart: (t: number) => number;
    easeInOutQuart: (t: number) => number;
    easeInQuint: (t: number) => number;
    easeOutQuint: (t: number) => number;
    easeInOutQuint: (t: number) => number;
    easeInSine: (t: number) => number;
    easeOutSine: (t: number) => number;
    easeInOutSine: (t: number) => number;
    easeInExpo: (t: number) => number;
    easeOutExpo: (t: number) => number;
    easeInOutExpo: (t: number) => number;
    easeInCirc: (t: number) => number;
    easeOutCirc: (t: number) => number;
    easeInOutCirc: (t: number) => number;
    easeInBack: (t: number) => number;
    easeOutBack: (t: number) => number;
    easeInOutBack: (t: number) => number;
    easeInElastic: (t: number) => number;
    easeOutElastic: (t: number) => number;
    easeInOutElastic: (t: number) => number;
    easeInBounce: (t: number) => number;
    easeOutBounce: (t: number) => number;
    easeInOutBounce: (t: number) => number;
}
export declare const easings: EasingDictionary;
export {};

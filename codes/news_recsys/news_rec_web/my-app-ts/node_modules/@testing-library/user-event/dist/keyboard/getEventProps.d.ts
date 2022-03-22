import { keyboardKey, keyboardState } from './types';
export declare function getKeyEventProps(keyDef: keyboardKey, state: keyboardState): {
    key: string | undefined;
    code: string | undefined;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    /** @deprecated use code instead */
    keyCode: number | undefined;
};
export declare function getMouseEventProps(state: keyboardState): {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
};

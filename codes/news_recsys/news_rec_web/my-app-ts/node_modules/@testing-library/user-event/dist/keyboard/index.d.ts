import { keyboardState, keyboardOptions, keyboardKey } from './types';
export { specialCharMap } from './specialCharMap';
export type { keyboardOptions, keyboardKey };
export declare function keyboard(text: string, options?: Partial<keyboardOptions & {
    keyboardState: keyboardState;
    delay: 0;
}>): keyboardState;
export declare function keyboard(text: string, options: Partial<keyboardOptions & {
    keyboardState: keyboardState;
    delay: number;
}>): Promise<keyboardState>;
export declare function keyboardImplementationWrapper(text: string, config?: Partial<keyboardOptions & {
    keyboardState: keyboardState;
}>): {
    promise: Promise<void>;
    state: keyboardState;
    releaseAllKeys: () => void;
};

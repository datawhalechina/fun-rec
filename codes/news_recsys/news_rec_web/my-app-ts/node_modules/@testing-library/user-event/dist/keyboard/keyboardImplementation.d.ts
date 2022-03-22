import { keyboardState, keyboardOptions } from './types';
export declare function keyboardImplementation(text: string, options: keyboardOptions, state: keyboardState): Promise<void>;
export declare function releaseAllKeys(options: keyboardOptions, state: keyboardState): void;

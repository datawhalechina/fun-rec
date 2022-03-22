import { keyboardKey, keyboardOptions } from './types';
/**
 * Get the next key from keyMap
 *
 * Keys can be referenced by `{key}` or `{special}` as well as physical locations per `[code]`.
 * Everything else will be interpreted as a typed character - e.g. `a`.
 * Brackets `{` and `[` can be escaped by doubling - e.g. `foo[[bar` translates to `foo[bar`.
 * Keeping the key pressed can be written as `{key>}`.
 * When keeping the key pressed you can choose how long (how many keydown and keypress) the key is pressed `{key>3}`.
 * You can then release the key per `{key>3/}` or keep it pressed and continue with the next key.
 * Modifiers like `{shift}` imply being kept pressed. This can be turned of per `{shift/}`.
 */
export declare function getNextKeyDef(text: string, options: keyboardOptions): {
    keyDef: keyboardKey;
    consumedLength: number;
    releasePrevious: boolean;
    releaseSelf: boolean;
    repeat: number;
};

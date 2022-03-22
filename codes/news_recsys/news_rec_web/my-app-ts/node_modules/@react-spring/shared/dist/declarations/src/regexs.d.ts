export declare const numberRegex: RegExp;
export declare const colorRegex: RegExp;
export declare const unitRegex: RegExp;
export declare const rgbaRegex: RegExp;
/**
 * Parse special CSS variable format into a CSS token and a fallback.
 *
 * ```
 * `var(--foo, #fff)` => [`--foo`, '#fff']
 * ```
 *
 */
export declare const cssVariableRegex: RegExp;

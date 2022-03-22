/**
 * takes a CSS variable and attempts
 * to turn it into a RGBA value
 *
 * ```
 * 'var(--white)' => 'rgba(255,255,255,1)'
 * ```
 *
 * @param input string
 * @returns string
 */
export declare const variableToRgba: (input: string) => string;

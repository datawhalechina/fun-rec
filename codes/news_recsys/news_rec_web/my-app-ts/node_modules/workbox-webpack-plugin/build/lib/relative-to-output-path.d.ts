import type { Compilation } from 'webpack';
/**
 * @param {Object} compilation The webpack compilation.
 * @param {string} swDest The original swDest value.
 *
 * @return {string} If swDest was not absolute, the returns swDest as-is.
 * Otherwise, returns swDest relative to the compilation's output path.
 *
 * @private
 */
export declare function relativeToOutputPath(compilation: Compilation, swDest: string): string;

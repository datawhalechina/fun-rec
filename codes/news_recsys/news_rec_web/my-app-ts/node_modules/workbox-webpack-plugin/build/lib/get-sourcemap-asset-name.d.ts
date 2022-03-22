import type { Compilation } from 'webpack';
/**
 * If our bundled swDest file contains a sourcemap, we would invalidate that
 * mapping if we just replaced injectionPoint with the stringified manifest.
 * Instead, we need to update the swDest contents as well as the sourcemap
 * at the same time.
 *
 * See https://github.com/GoogleChrome/workbox/issues/2235
 *
 * @param {Object} compilation The current webpack compilation.
 * @param {string} swContents The contents of the swSrc file, which may or
 * may not include a valid sourcemap comment.
 * @param {string} swDest The configured swDest value.
 * @return {string|undefined} If the swContents contains a valid sourcemap
 * comment pointing to an asset present in the compilation, this will return the
 * name of that asset. Otherwise, it will return undefined.
 *
 * @private
 */
export declare function getSourcemapAssetName(compilation: Compilation, swContents: string, swDest: string): string | undefined;

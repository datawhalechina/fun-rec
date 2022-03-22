import webpack from 'webpack';
import { ManifestEntry, WebpackGenerateSWOptions } from 'workbox-build';
interface GenerateSWConfig extends WebpackGenerateSWOptions {
    manifestEntries?: Array<ManifestEntry>;
}
/**
 * This class supports creating a new, ready-to-use service worker file as
 * part of the webpack compilation process.
 *
 * Use an instance of `GenerateSW` in the
 * [`plugins` array](https://webpack.js.org/concepts/plugins/#usage) of a
 * webpack config.
 *
 * @example
 * // The following lists some common options; see the rest of the documentation
 * // for the full set of options and defaults.
 * new GenerateSW({
 *   exclude: [/.../, '...'],
 *   maximumFileSizeToCacheInBytes: ...,
 *   navigateFallback: '...',
 *   runtimeCaching: [{
 *     // Routing via a matchCallback function:
 *     urlPattern: ({request, url}) => ...,
 *     handler: '...',
 *     options: {
 *       cacheName: '...',
 *       expiration: {
 *         maxEntries: ...,
 *       },
 *     },
 *   }, {
 *     // Routing via a RegExp:
 *     urlPattern: new RegExp('...'),
 *     handler: '...',
 *     options: {
 *       cacheName: '...',
 *       plugins: [..., ...],
 *     },
 *   }],
 *   skipWaiting: ...,
 * });
 *
 * @memberof module:workbox-webpack-plugin
 */
declare class GenerateSW {
    private config;
    private alreadyCalled;
    /**
     * Creates an instance of GenerateSW.
     */
    constructor(config?: GenerateSWConfig);
    /**
     * @param {Object} [compiler] default compiler object passed from webpack
     *
     * @private
     */
    propagateWebpackConfig(compiler: webpack.Compiler): void;
    /**
     * @param {Object} [compiler] default compiler object passed from webpack
     *
     * @private
     */
    apply(compiler: webpack.Compiler): void;
    /**
     * @param {Object} compilation The webpack compilation.
     *
     * @private
     */
    addAssets(compilation: webpack.Compilation): Promise<void>;
}
export { GenerateSW };

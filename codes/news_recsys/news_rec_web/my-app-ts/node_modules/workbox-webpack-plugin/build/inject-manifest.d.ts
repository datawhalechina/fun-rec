import webpack from 'webpack';
import { WebpackInjectManifestOptions } from 'workbox-build';
/**
 * This class supports compiling a service worker file provided via `swSrc`,
 * and injecting into that service worker a list of URLs and revision
 * information for precaching based on the webpack asset pipeline.
 *
 * Use an instance of `InjectManifest` in the
 * [`plugins` array](https://webpack.js.org/concepts/plugins/#usage) of a
 * webpack config.
 *
 * In addition to injecting the manifest, this plugin will perform a compilation
 * of the `swSrc` file, using the options from the main webpack configuration.
 *
 * @example
 * // The following lists some common options; see the rest of the documentation
 * // for the full set of options and defaults.
 * new InjectManifest({
 *   exclude: [/.../, '...'],
 *   maximumFileSizeToCacheInBytes: ...,
 *   swSrc: '...',
 * });
 *
 * @memberof module:workbox-webpack-plugin
 */
declare class InjectManifest {
    private config;
    private alreadyCalled;
    /**
     * Creates an instance of InjectManifest.
     */
    constructor(config: WebpackInjectManifestOptions);
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
     * @param {Object} parentCompiler The webpack parent compiler.
     *
     * @private
     */
    performChildCompilation(compilation: webpack.Compilation, parentCompiler: webpack.Compiler): Promise<void>;
    /**
     * @param {Object} compilation The webpack compilation.
     * @param {Object} parentCompiler The webpack parent compiler.
     *
     * @private
     */
    addSrcToAssets(compilation: webpack.Compilation, parentCompiler: webpack.Compiler): void;
    /**
     * @param {Object} compilation The webpack compilation.
     * @param {Object} parentCompiler The webpack parent compiler.
     *
     * @private
     */
    handleMake(compilation: webpack.Compilation, parentCompiler: webpack.Compiler): Promise<void>;
    /**
     * @param {Object} compilation The webpack compilation.
     *
     * @private
     */
    addAssets(compilation: webpack.Compilation): Promise<void>;
}
export { InjectManifest };

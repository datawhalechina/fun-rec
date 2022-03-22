"use strict";
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSW = void 0;
const validate_options_1 = require("workbox-build/build/lib/validate-options");
const bundle_1 = require("workbox-build/build/lib/bundle");
const populate_sw_template_1 = require("workbox-build/build/lib/populate-sw-template");
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const webpack_1 = __importDefault(require("webpack"));
const get_script_files_for_chunks_1 = require("./lib/get-script-files-for-chunks");
const get_manifest_entries_from_compilation_1 = require("./lib/get-manifest-entries-from-compilation");
const relative_to_output_path_1 = require("./lib/relative-to-output-path");
// webpack v4/v5 compatibility:
// https://github.com/webpack/webpack/issues/11425#issuecomment-686607633
const { RawSource } = webpack_1.default.sources || require('webpack-sources');
// Used to keep track of swDest files written by *any* instance of this plugin.
// See https://github.com/GoogleChrome/workbox/issues/2181
const _generatedAssetNames = new Set();
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
class GenerateSW {
    /**
     * Creates an instance of GenerateSW.
     */
    constructor(config = {}) {
        this.config = config;
        this.alreadyCalled = false;
    }
    /**
     * @param {Object} [compiler] default compiler object passed from webpack
     *
     * @private
     */
    propagateWebpackConfig(compiler) {
        // Because this.config is listed last, properties that are already set
        // there take precedence over derived properties from the compiler.
        this.config = Object.assign({
            mode: compiler.options.mode,
            sourcemap: Boolean(compiler.options.devtool),
        }, this.config);
    }
    /**
     * @param {Object} [compiler] default compiler object passed from webpack
     *
     * @private
     */
    apply(compiler) {
        this.propagateWebpackConfig(compiler);
        // webpack v4/v5 compatibility:
        // https://github.com/webpack/webpack/issues/11425#issuecomment-690387207
        if (webpack_1.default.version.startsWith('4.')) {
            compiler.hooks.emit.tapPromise(this.constructor.name, (compilation) => this.addAssets(compilation).catch((error) => {
                compilation.errors.push(error);
            }));
        }
        else {
            const { PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER } = webpack_1.default.Compilation;
            // Specifically hook into thisCompilation, as per
            // https://github.com/webpack/webpack/issues/11425#issuecomment-690547848
            compiler.hooks.thisCompilation.tap(this.constructor.name, (compilation) => {
                compilation.hooks.processAssets.tapPromise({
                    name: this.constructor.name,
                    // TODO(jeffposnick): This may need to change eventually.
                    // See https://github.com/webpack/webpack/issues/11822#issuecomment-726184972
                    stage: PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER - 10,
                }, () => this.addAssets(compilation).catch((error) => {
                    compilation.errors.push(error);
                }));
            });
        }
    }
    /**
     * @param {Object} compilation The webpack compilation.
     *
     * @private
     */
    async addAssets(compilation) {
        var _a;
        // See https://github.com/GoogleChrome/workbox/issues/1790
        if (this.alreadyCalled) {
            const warningMessage = `${this.constructor.name} has been called ` +
                `multiple times, perhaps due to running webpack in --watch mode. The ` +
                `precache manifest generated after the first call may be inaccurate! ` +
                `Please see https://github.com/GoogleChrome/workbox/issues/1790 for ` +
                `more information.`;
            if (!compilation.warnings.some((warning) => warning instanceof Error && warning.message === warningMessage)) {
                compilation.warnings.push(Error(warningMessage));
            }
        }
        else {
            this.alreadyCalled = true;
        }
        let config = {};
        try {
            // emit might be called multiple times; instead of modifying this.config,
            // use a validated copy.
            // See https://github.com/GoogleChrome/workbox/issues/2158
            config = (0, validate_options_1.validateWebpackGenerateSWOptions)(this.config);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Please check your ${this.constructor.name} plugin ` +
                    `configuration:\n${error.message}`);
            }
        }
        // Ensure that we don't precache any of the assets generated by *any*
        // instance of this plugin.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        config.exclude.push(({ asset }) => _generatedAssetNames.has(asset.name));
        if (config.importScriptsViaChunks) {
            // Anything loaded via importScripts() is implicitly cached by the service
            // worker, and should not be added to the precache manifest.
            config.excludeChunks = (config.excludeChunks || []).concat(config.importScriptsViaChunks);
            const scripts = (0, get_script_files_for_chunks_1.getScriptFilesForChunks)(compilation, config.importScriptsViaChunks);
            config.importScripts = (config.importScripts || []).concat(scripts);
        }
        const { size, sortedEntries } = await (0, get_manifest_entries_from_compilation_1.getManifestEntriesFromCompilation)(compilation, config);
        config.manifestEntries = sortedEntries;
        const unbundledCode = (0, populate_sw_template_1.populateSWTemplate)(config);
        const files = await (0, bundle_1.bundle)({
            babelPresetEnvTargets: config.babelPresetEnvTargets,
            inlineWorkboxRuntime: config.inlineWorkboxRuntime,
            mode: config.mode,
            sourcemap: config.sourcemap,
            swDest: (0, relative_to_output_path_1.relativeToOutputPath)(compilation, config.swDest),
            unbundledCode,
        });
        for (const file of files) {
            compilation.emitAsset(file.name, new RawSource(Buffer.from(file.contents)), {
                // See https://github.com/webpack-contrib/compression-webpack-plugin/issues/218#issuecomment-726196160
                minimized: config.mode === 'production',
            });
            _generatedAssetNames.add(file.name);
        }
        if (compilation.getLogger) {
            const logger = compilation.getLogger(this.constructor.name);
            logger.info(`The service worker at ${(_a = config.swDest) !== null && _a !== void 0 ? _a : ''} will precache
        ${config.manifestEntries.length} URLs, totaling ${(0, pretty_bytes_1.default)(size)}.`);
        }
    }
}
exports.GenerateSW = GenerateSW;

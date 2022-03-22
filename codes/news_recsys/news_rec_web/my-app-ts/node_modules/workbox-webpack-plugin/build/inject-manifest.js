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
exports.InjectManifest = void 0;
const escape_regexp_1 = require("workbox-build/build/lib/escape-regexp");
const replace_and_update_source_map_1 = require("workbox-build/build/lib/replace-and-update-source-map");
const validate_options_1 = require("workbox-build/build/lib/validate-options");
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
const upath_1 = __importDefault(require("upath"));
const webpack_1 = __importDefault(require("webpack"));
const get_manifest_entries_from_compilation_1 = require("./lib/get-manifest-entries-from-compilation");
const get_sourcemap_asset_name_1 = require("./lib/get-sourcemap-asset-name");
const relative_to_output_path_1 = require("./lib/relative-to-output-path");
// Used to keep track of swDest files written by *any* instance of this plugin.
// See https://github.com/GoogleChrome/workbox/issues/2181
const _generatedAssetNames = new Set();
// SingleEntryPlugin in v4 was renamed to EntryPlugin in v5.
const SingleEntryPlugin = webpack_1.default.EntryPlugin || webpack_1.default.SingleEntryPlugin;
// webpack v4/v5 compatibility:
// https://github.com/webpack/webpack/issues/11425#issuecomment-686607633
const { RawSource } = webpack_1.default.sources || require('webpack-sources');
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
class InjectManifest {
    /**
     * Creates an instance of InjectManifest.
     */
    constructor(config) {
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
            // Use swSrc with a hardcoded .js extension, in case swSrc is a .ts file.
            swDest: upath_1.default.parse(this.config.swSrc).name + '.js',
        }, this.config);
    }
    /**
     * @param {Object} [compiler] default compiler object passed from webpack
     *
     * @private
     */
    apply(compiler) {
        var _a;
        this.propagateWebpackConfig(compiler);
        compiler.hooks.make.tapPromise(this.constructor.name, (compilation) => this.handleMake(compilation, compiler).catch((error) => {
            compilation.errors.push(error);
        }));
        // webpack v4/v5 compatibility:
        // https://github.com/webpack/webpack/issues/11425#issuecomment-690387207
        if ((_a = webpack_1.default.version) === null || _a === void 0 ? void 0 : _a.startsWith('4.')) {
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
     * @param {Object} parentCompiler The webpack parent compiler.
     *
     * @private
     */
    async performChildCompilation(compilation, parentCompiler) {
        const outputOptions = {
            path: parentCompiler.options.output.path,
            filename: this.config.swDest,
        };
        const childCompiler = compilation.createChildCompiler(this.constructor.name, outputOptions, []);
        childCompiler.context = parentCompiler.context;
        childCompiler.inputFileSystem = parentCompiler.inputFileSystem;
        childCompiler.outputFileSystem = parentCompiler.outputFileSystem;
        if (Array.isArray(this.config.webpackCompilationPlugins)) {
            for (const plugin of this.config.webpackCompilationPlugins) {
                // plugin has a generic type, eslint complains for an unsafe
                // assign and unsafe use
                // eslint-disable-next-line
                plugin.apply(childCompiler);
            }
        }
        new SingleEntryPlugin(parentCompiler.context, this.config.swSrc, this.constructor.name).apply(childCompiler);
        await new Promise((resolve, reject) => {
            childCompiler.runAsChild((error, _entries, childCompilation) => {
                var _a, _b;
                if (error) {
                    reject(error);
                }
                else {
                    compilation.warnings = compilation.warnings.concat((_a = childCompilation === null || childCompilation === void 0 ? void 0 : childCompilation.warnings) !== null && _a !== void 0 ? _a : []);
                    compilation.errors = compilation.errors.concat((_b = childCompilation === null || childCompilation === void 0 ? void 0 : childCompilation.errors) !== null && _b !== void 0 ? _b : []);
                    resolve();
                }
            });
        });
    }
    /**
     * @param {Object} compilation The webpack compilation.
     * @param {Object} parentCompiler The webpack parent compiler.
     *
     * @private
     */
    addSrcToAssets(compilation, parentCompiler) {
        // eslint-disable-next-line
        const source = parentCompiler.inputFileSystem.readFileSync(this.config.swSrc);
        compilation.emitAsset(this.config.swDest, new RawSource(source));
    }
    /**
     * @param {Object} compilation The webpack compilation.
     * @param {Object} parentCompiler The webpack parent compiler.
     *
     * @private
     */
    async handleMake(compilation, parentCompiler) {
        try {
            this.config = (0, validate_options_1.validateWebpackInjectManifestOptions)(this.config);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Please check your ${this.constructor.name} plugin ` +
                    `configuration:\n${error.message}`);
            }
        }
        this.config.swDest = (0, relative_to_output_path_1.relativeToOutputPath)(compilation, this.config.swDest);
        _generatedAssetNames.add(this.config.swDest);
        if (this.config.compileSrc) {
            await this.performChildCompilation(compilation, parentCompiler);
        }
        else {
            this.addSrcToAssets(compilation, parentCompiler);
            // This used to be a fatal error, but just warn at runtime because we
            // can't validate it easily.
            if (Array.isArray(this.config.webpackCompilationPlugins) &&
                this.config.webpackCompilationPlugins.length > 0) {
                compilation.warnings.push(new Error('compileSrc is false, so the ' +
                    'webpackCompilationPlugins option will be ignored.'));
            }
        }
    }
    /**
     * @param {Object} compilation The webpack compilation.
     *
     * @private
     */
    async addAssets(compilation) {
        var _a, _b, _c, _d, _e;
        // See https://github.com/GoogleChrome/workbox/issues/1790
        if (this.alreadyCalled) {
            const warningMessage = `${this.constructor.name} has been called ` +
                `multiple times, perhaps due to running webpack in --watch mode. The ` +
                `precache manifest generated after the first call may be inaccurate! ` +
                `Please see https://github.com/GoogleChrome/workbox/issues/1790 for ` +
                `more information.`;
            if (!compilation.warnings.some((warning) => warning instanceof Error && warning.message === warningMessage)) {
                compilation.warnings.push(new Error(warningMessage));
            }
        }
        else {
            this.alreadyCalled = true;
        }
        const config = Object.assign({}, this.config);
        // Ensure that we don't precache any of the assets generated by *any*
        // instance of this plugin.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        config.exclude.push(({ asset }) => _generatedAssetNames.has(asset.name));
        // See https://webpack.js.org/contribute/plugin-patterns/#monitoring-the-watch-graph
        const absoluteSwSrc = upath_1.default.resolve(this.config.swSrc);
        compilation.fileDependencies.add(absoluteSwSrc);
        const swAsset = compilation.getAsset(config.swDest);
        const swAssetString = swAsset.source.source().toString();
        const globalRegexp = new RegExp((0, escape_regexp_1.escapeRegExp)(config.injectionPoint), 'g');
        const injectionResults = swAssetString.match(globalRegexp);
        if (!injectionResults) {
            throw new Error(`Can't find ${(_a = config.injectionPoint) !== null && _a !== void 0 ? _a : ''} in your SW source.`);
        }
        if (injectionResults.length !== 1) {
            throw new Error(`Multiple instances of ${(_b = config.injectionPoint) !== null && _b !== void 0 ? _b : ''} were ` +
                `found in your SW source. Include it only once. For more info, see ` +
                `https://github.com/GoogleChrome/workbox/issues/2681`);
        }
        const { size, sortedEntries } = await (0, get_manifest_entries_from_compilation_1.getManifestEntriesFromCompilation)(compilation, config);
        let manifestString = (0, fast_json_stable_stringify_1.default)(sortedEntries);
        if (this.config.compileSrc &&
            // See https://github.com/GoogleChrome/workbox/issues/2729
            !(((_c = compilation.options) === null || _c === void 0 ? void 0 : _c.devtool) === 'eval-cheap-source-map' &&
                ((_d = compilation.options.optimization) === null || _d === void 0 ? void 0 : _d.minimize))) {
            // See https://github.com/GoogleChrome/workbox/issues/2263
            manifestString = manifestString.replace(/"/g, `'`);
        }
        const sourcemapAssetName = (0, get_sourcemap_asset_name_1.getSourcemapAssetName)(compilation, swAssetString, config.swDest);
        if (sourcemapAssetName) {
            _generatedAssetNames.add(sourcemapAssetName);
            const sourcemapAsset = compilation.getAsset(sourcemapAssetName);
            const { source, map } = await (0, replace_and_update_source_map_1.replaceAndUpdateSourceMap)({
                jsFilename: config.swDest,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                originalMap: JSON.parse(sourcemapAsset.source.source().toString()),
                originalSource: swAssetString,
                replaceString: manifestString,
                searchString: config.injectionPoint,
            });
            compilation.updateAsset(sourcemapAssetName, new RawSource(map));
            compilation.updateAsset(config.swDest, new RawSource(source));
        }
        else {
            // If there's no sourcemap associated with swDest, a simple string
            // replacement will suffice.
            compilation.updateAsset(config.swDest, new RawSource(swAssetString.replace(config.injectionPoint, manifestString)));
        }
        if (compilation.getLogger) {
            const logger = compilation.getLogger(this.constructor.name);
            logger.info(`The service worker at ${(_e = config.swDest) !== null && _e !== void 0 ? _e : ''} will precache
        ${sortedEntries.length} URLs, totaling ${(0, pretty_bytes_1.default)(size)}.`);
        }
    }
}
exports.InjectManifest = InjectManifest;

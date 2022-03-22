"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackManifestPlugin = exports.getCompilerHooks = void 0;
const path_1 = require("path");
const webpack_1 = __importDefault(require("webpack"));
const NormalModule_1 = __importDefault(require("webpack/lib/NormalModule"));
const hooks_1 = require("./hooks");
Object.defineProperty(exports, "getCompilerHooks", { enumerable: true, get: function () { return hooks_1.getCompilerHooks; } });
const emitCountMap = new Map();
const defaults = {
    assetHookStage: Infinity,
    basePath: '',
    fileName: 'manifest.json',
    filter: null,
    generate: void 0,
    map: null,
    publicPath: null,
    removeKeyHash: /([a-f0-9]{16,32}\.?)/gi,
    seed: void 0,
    serialize(manifest) {
        return JSON.stringify(manifest, null, 2);
    },
    sort: null,
    transformExtensions: /^(gz|map)$/i,
    useEntryKeys: false,
    useLegacyEmit: false,
    writeToFileEmit: false
};
class WebpackManifestPlugin {
    constructor(opts) {
        this.options = Object.assign({}, defaults, opts);
    }
    apply(compiler) {
        var _a, _b, _c;
        const moduleAssets = {};
        const manifestFileName = path_1.resolve(((_a = compiler.options.output) === null || _a === void 0 ? void 0 : _a.path) || './', this.options.fileName);
        const manifestAssetId = path_1.relative(((_b = compiler.options.output) === null || _b === void 0 ? void 0 : _b.path) || './', manifestFileName);
        const beforeRun = hooks_1.beforeRunHook.bind(this, { emitCountMap, manifestFileName });
        const emit = hooks_1.emitHook.bind(this, {
            compiler,
            emitCountMap,
            manifestAssetId,
            manifestFileName,
            moduleAssets,
            options: this.options
        });
        const normalModuleLoader = hooks_1.normalModuleLoaderHook.bind(this, { moduleAssets });
        const hookOptions = {
            name: 'WebpackManifestPlugin',
            stage: this.options.assetHookStage
        };
        compiler.hooks.compilation.tap(hookOptions, (compilation) => {
            const hook = !NormalModule_1.default.getCompilationHooks
                ? compilation.hooks.normalModuleLoader
                : NormalModule_1.default.getCompilationHooks(compilation).loader;
            hook.tap(hookOptions, normalModuleLoader);
        });
        if (((_c = webpack_1.default.version) === null || _c === void 0 ? void 0 : _c.startsWith('4')) || this.options.useLegacyEmit === true) {
            compiler.hooks.emit.tap(hookOptions, emit);
        }
        else {
            compiler.hooks.thisCompilation.tap(hookOptions, (compilation) => {
                compilation.hooks.processAssets.tap(hookOptions, () => emit(compilation));
            });
        }
        compiler.hooks.run.tap(hookOptions, beforeRun);
        compiler.hooks.watchRun.tap(hookOptions, beforeRun);
    }
}
exports.WebpackManifestPlugin = WebpackManifestPlugin;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalModuleLoaderHook = exports.getCompilerHooks = exports.emitHook = exports.beforeRunHook = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const tapable_1 = require("tapable");
const webpack_sources_1 = require("webpack-sources");
const helpers_1 = require("./helpers");
const compilerHookMap = new WeakMap();
const getCompilerHooks = (compiler) => {
    let hooks = compilerHookMap.get(compiler);
    if (typeof hooks === 'undefined') {
        hooks = {
            afterEmit: new tapable_1.SyncWaterfallHook(['manifest']),
            beforeEmit: new tapable_1.SyncWaterfallHook(['manifest'])
        };
        compilerHookMap.set(compiler, hooks);
    }
    return hooks;
};
exports.getCompilerHooks = getCompilerHooks;
const beforeRunHook = ({ emitCountMap, manifestFileName }, _, callback) => {
    const emitCount = emitCountMap.get(manifestFileName) || 0;
    emitCountMap.set(manifestFileName, emitCount + 1);
    if (callback) {
        callback();
    }
};
exports.beforeRunHook = beforeRunHook;
const emitHook = function emit({ compiler, emitCountMap, manifestAssetId, manifestFileName, moduleAssets, options }, compilation) {
    const emitCount = emitCountMap.get(manifestFileName) - 1;
    const stats = compilation.getStats().toJson({
        all: false,
        assets: true,
        cachedAssets: true,
        ids: true,
        publicPath: true
    });
    const publicPath = options.publicPath !== null ? options.publicPath : stats.publicPath;
    const { basePath, removeKeyHash } = options;
    emitCountMap.set(manifestFileName, emitCount);
    const auxiliaryFiles = {};
    let files = Array.from(compilation.chunks).reduce((prev, chunk) => helpers_1.reduceChunk(prev, chunk, options, auxiliaryFiles), []);
    files = stats.assets.reduce((prev, asset) => helpers_1.reduceAssets(prev, asset, moduleAssets), files);
    files = files.filter(({ name, path }) => {
        var _a;
        return !path.includes('hot-update') &&
            typeof emitCountMap.get(path_1.join(((_a = compiler.options.output) === null || _a === void 0 ? void 0 : _a.path) || '<unknown>', name)) ===
                'undefined';
    });
    files.forEach((file) => {
        delete auxiliaryFiles[file.path];
    });
    Object.keys(auxiliaryFiles).forEach((auxiliaryFile) => {
        files = files.concat(auxiliaryFiles[auxiliaryFile]);
    });
    files = files.map((file) => {
        const normalizePath = (path) => {
            if (!path.endsWith('/')) {
                return `${path}/`;
            }
            return path;
        };
        const changes = {
            name: basePath ? normalizePath(basePath) + file.name : file.name,
            path: publicPath ? normalizePath(publicPath) + file.path : file.path
        };
        changes.name = removeKeyHash ? changes.name.replace(removeKeyHash, '') : changes.name;
        return Object.assign(file, changes);
    });
    files = helpers_1.transformFiles(files, options);
    let manifest = helpers_1.generateManifest(compilation, files, options);
    const isLastEmit = emitCount === 0;
    manifest = getCompilerHooks(compiler).beforeEmit.call(manifest);
    if (isLastEmit) {
        const output = options.serialize(manifest);
        compilation.emitAsset(manifestAssetId, new webpack_sources_1.RawSource(output));
        if (options.writeToFileEmit) {
            fs_1.mkdirSync(path_1.dirname(manifestFileName), { recursive: true });
            fs_1.writeFileSync(manifestFileName, output);
        }
    }
    getCompilerHooks(compiler).afterEmit.call(manifest);
};
exports.emitHook = emitHook;
const normalModuleLoaderHook = ({ moduleAssets }, loaderContext, module) => {
    const { emitFile } = loaderContext;
    loaderContext.emitFile = (file, content, sourceMap) => {
        if (module.userRequest && !moduleAssets[file]) {
            Object.assign(moduleAssets, { [file]: path_1.join(path_1.dirname(file), path_1.basename(module.userRequest)) });
        }
        return emitFile.call(module, file, content, sourceMap);
    };
};
exports.normalModuleLoaderHook = normalModuleLoaderHook;
//# sourceMappingURL=hooks.js.map
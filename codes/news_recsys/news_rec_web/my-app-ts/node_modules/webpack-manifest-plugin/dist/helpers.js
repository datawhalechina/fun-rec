"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFiles = exports.reduceChunk = exports.reduceAssets = exports.generateManifest = void 0;
const path_1 = require("path");
const generateManifest = (compilation, files, { generate, seed = {} }) => {
    let result;
    if (generate) {
        const entrypointsArray = Array.from(compilation.entrypoints.entries());
        const entrypoints = entrypointsArray.reduce((e, [name, entrypoint]) => Object.assign(e, { [name]: entrypoint.getFiles() }), {});
        result = generate(seed, files, entrypoints);
    }
    else {
        result = files.reduce((manifest, file) => Object.assign(manifest, { [file.name]: file.path }), seed);
    }
    return result;
};
exports.generateManifest = generateManifest;
const getFileType = (fileName, { transformExtensions }) => {
    const replaced = fileName.replace(/\?.*/, '');
    const split = replaced.split('.');
    const extension = split.pop();
    return transformExtensions.test(extension) ? `${split.pop()}.${extension}` : extension;
};
const reduceAssets = (files, asset, moduleAssets) => {
    let name;
    if (moduleAssets[asset.name]) {
        name = moduleAssets[asset.name];
    }
    else if (asset.info.sourceFilename) {
        name = path_1.join(path_1.dirname(asset.name), path_1.basename(asset.info.sourceFilename));
    }
    if (name) {
        return files.concat({
            isAsset: true,
            isChunk: false,
            isInitial: false,
            isModuleAsset: true,
            name,
            path: asset.name
        });
    }
    const isEntryAsset = asset.chunks && asset.chunks.length > 0;
    if (isEntryAsset) {
        return files;
    }
    return files.concat({
        isAsset: true,
        isChunk: false,
        isInitial: false,
        isModuleAsset: false,
        name: asset.name,
        path: asset.name
    });
};
exports.reduceAssets = reduceAssets;
const reduceChunk = (files, chunk, options, auxiliaryFiles) => {
    Array.from(chunk.auxiliaryFiles || []).forEach((auxiliaryFile) => {
        auxiliaryFiles[auxiliaryFile] = {
            isAsset: true,
            isChunk: false,
            isInitial: false,
            isModuleAsset: true,
            name: path_1.basename(auxiliaryFile),
            path: auxiliaryFile
        };
    });
    return Array.from(chunk.files).reduce((prev, path) => {
        let name = chunk.name ? chunk.name : null;
        name = name
            ? options.useEntryKeys && !path.endsWith('.map')
                ? name
                : `${name}.${getFileType(path, options)}`
            : path;
        return prev.concat({
            chunk,
            isAsset: false,
            isChunk: true,
            isInitial: chunk.isOnlyInitial(),
            isModuleAsset: false,
            name,
            path
        });
    }, files);
};
exports.reduceChunk = reduceChunk;
const standardizeFilePaths = (file) => {
    const result = Object.assign({}, file);
    result.name = file.name.replace(/\\/g, '/');
    result.path = file.path.replace(/\\/g, '/');
    return result;
};
const transformFiles = (files, options) => ['filter', 'map', 'sort']
    .filter((fname) => !!options[fname])
    .reduce((prev, fname) => prev[fname](options[fname]), files)
    .map(standardizeFilePaths);
exports.transformFiles = transformFiles;
//# sourceMappingURL=helpers.js.map
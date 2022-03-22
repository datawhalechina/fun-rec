"use strict";
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScriptFilesForChunks = void 0;
const upath_1 = __importDefault(require("upath"));
const resolve_webpack_url_1 = require("./resolve-webpack-url");
function getScriptFilesForChunks(compilation, chunkNames) {
    var _a;
    const { chunks } = compilation.getStats().toJson({ chunks: true });
    const { publicPath } = compilation.options.output;
    const scriptFiles = new Set();
    for (const chunkName of chunkNames) {
        const chunk = chunks.find((chunk) => { var _a; return (_a = chunk.names) === null || _a === void 0 ? void 0 : _a.includes(chunkName); });
        if (chunk) {
            for (const file of (_a = chunk === null || chunk === void 0 ? void 0 : chunk.files) !== null && _a !== void 0 ? _a : []) {
                // See https://github.com/GoogleChrome/workbox/issues/2161
                if (upath_1.default.extname(file) === '.js') {
                    scriptFiles.add((0, resolve_webpack_url_1.resolveWebpackURL)(publicPath, file));
                }
            }
        }
        else {
            compilation.warnings.push(new Error(`${chunkName} was provided to ` +
                `importScriptsViaChunks, but didn't match any named chunks.`));
        }
    }
    if (scriptFiles.size === 0) {
        compilation.warnings.push(new Error(`There were no assets matching ` +
            `importScriptsViaChunks: [${chunkNames.join(' ')}].`));
    }
    return Array.from(scriptFiles);
}
exports.getScriptFilesForChunks = getScriptFilesForChunks;

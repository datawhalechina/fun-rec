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
exports.relativeToOutputPath = void 0;
const upath_1 = __importDefault(require("upath"));
/**
 * @param {Object} compilation The webpack compilation.
 * @param {string} swDest The original swDest value.
 *
 * @return {string} If swDest was not absolute, the returns swDest as-is.
 * Otherwise, returns swDest relative to the compilation's output path.
 *
 * @private
 */
function relativeToOutputPath(compilation, swDest) {
    // See https://github.com/jantimon/html-webpack-plugin/pull/266/files#diff-168726dbe96b3ce427e7fedce31bb0bcR38
    if (upath_1.default.resolve(swDest) === upath_1.default.normalize(swDest)) {
        return upath_1.default.relative(compilation.options.output.path, swDest);
    }
    // Otherwise, return swDest as-is.
    return swDest;
}
exports.relativeToOutputPath = relativeToOutputPath;

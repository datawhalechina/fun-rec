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
exports.getAssetHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * @param {Asset} asset
 * @return {string} The MD5 hash of the asset's source.
 *
 * @private
 */
function getAssetHash(asset) {
    // If webpack has the asset marked as immutable, then we don't need to
    // use an out-of-band revision for it.
    // See https://github.com/webpack/webpack/issues/9038
    if (asset.info && asset.info.immutable) {
        return null;
    }
    return crypto_1.default.createHash('md5')
        .update(Buffer.from(asset.source.source()))
        .digest('hex');
}
exports.getAssetHash = getAssetHash;

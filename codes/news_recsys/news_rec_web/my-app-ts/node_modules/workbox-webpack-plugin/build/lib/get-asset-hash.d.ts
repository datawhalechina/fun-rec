import type { Asset } from 'webpack';
/**
 * @param {Asset} asset
 * @return {string} The MD5 hash of the asset's source.
 *
 * @private
 */
export declare function getAssetHash(asset: Asset): string | null;

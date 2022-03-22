/**
 * Resolves a url in the way that webpack would (with string concatenation)
 *
 * Use publicPath + filePath instead of url.resolve(publicPath, filePath) see:
 * https://webpack.js.org/configuration/output/#output-publicpath
 *
 * @function resolveWebpackURL
 * @param {string} publicPath The publicPath value from webpack's compilation.
 * @param {Array<string>} paths File paths to join
 * @return {string} Joined file path
 *
 * @private
 */
export declare function resolveWebpackURL(publicPath: string, ...paths: Array<string>): string;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _url = _interopRequireDefault(require("url"));

var _path = _interopRequireDefault(require("path"));

var _options = _interopRequireDefault(require("./options.json"));

var _utils = require("./utils");

var _SassError = _interopRequireDefault(require("./SassError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The sass-loader makes node-sass and dart-sass available to webpack modules.
 *
 * @this {object}
 * @param {string} content
 */
async function loader(content) {
  const options = this.getOptions(_options.default);
  const callback = this.async();
  const implementation = (0, _utils.getSassImplementation)(this, options.implementation);

  if (!implementation) {
    callback();
    return;
  }

  const useSourceMap = typeof options.sourceMap === "boolean" ? options.sourceMap : this.sourceMap;
  const sassOptions = await (0, _utils.getSassOptions)(this, options, content, implementation, useSourceMap);
  const shouldUseWebpackImporter = typeof options.webpackImporter === "boolean" ? options.webpackImporter : true;

  if (shouldUseWebpackImporter) {
    const isModernAPI = options.api === "modern";

    if (!isModernAPI) {
      const {
        includePaths
      } = sassOptions;
      sassOptions.importer.push((0, _utils.getWebpackImporter)(this, implementation, includePaths));
    } else {
      sassOptions.importers.push((0, _utils.getModernWebpackImporter)(this, implementation));
    }
  }

  const compile = (0, _utils.getCompileFn)(implementation, options);
  let result;

  try {
    result = await compile(sassOptions, options);
  } catch (error) {
    // There are situations when the `file`/`span.url` property do not exist
    // Modern API
    if (error.span && typeof error.span.url !== "undefined") {
      this.addDependency(_url.default.fileURLToPath(error.span.url));
    } // Legacy API
    else if (typeof error.file !== "undefined") {
      // `node-sass` returns POSIX paths
      this.addDependency(_path.default.normalize(error.file));
    }

    callback(new _SassError.default(error));
    return;
  }

  let map = // Modern API, then legacy API
  result.sourceMap ? result.sourceMap : result.map ? JSON.parse(result.map) : null; // Modify source paths only for webpack, otherwise we do nothing

  if (map && useSourceMap) {
    map = (0, _utils.normalizeSourceMap)(map, this.rootContext);
  } // Modern API


  if (typeof result.loadedUrls !== "undefined") {
    result.loadedUrls.forEach(includedFile => {
      const normalizedIncludedFile = _url.default.fileURLToPath(includedFile); // Custom `importer` can return only `contents` so includedFile will be relative


      if (_path.default.isAbsolute(normalizedIncludedFile)) {
        this.addDependency(normalizedIncludedFile);
      }
    });
  } // Legacy API
  else if (typeof result.stats !== "undefined" && typeof result.stats.includedFiles !== "undefined") {
    result.stats.includedFiles.forEach(includedFile => {
      const normalizedIncludedFile = _path.default.normalize(includedFile); // Custom `importer` can return only `contents` so includedFile will be relative


      if (_path.default.isAbsolute(normalizedIncludedFile)) {
        this.addDependency(normalizedIncludedFile);
      }
    });
  }

  callback(null, result.css.toString(), map);
}

var _default = loader;
exports.default = _default;
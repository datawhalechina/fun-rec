"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLessImplementation = getLessImplementation;
exports.getLessOptions = getLessOptions;
exports.isUnsupportedUrl = isUnsupportedUrl;
exports.normalizeSourceMap = normalizeSourceMap;

var _path = _interopRequireDefault(require("path"));

var _full = require("klona/full");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable class-methods-use-this */
const trailingSlash = /[/\\]$/; // This somewhat changed in Less 3.x. Now the file name comes without the
// automatically added extension whereas the extension is passed in as `options.ext`.
// So, if the file name matches this regexp, we simply ignore the proposed extension.

const IS_SPECIAL_MODULE_IMPORT = /^~[^/]+$/; // `[drive_letter]:\` + `\\[server]\[sharename]\`

const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i; // Examples:
// - ~package
// - ~package/
// - ~@org
// - ~@org/
// - ~@org/package
// - ~@org/package/

const IS_MODULE_IMPORT = /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/;
const MODULE_REQUEST_REGEX = /^[^?]*~/;
/**
 * Creates a Less plugin that uses webpack's resolving engine that is provided by the loaderContext.
 *
 * @param {LoaderContext} loaderContext
 * @param {object} implementation
 * @returns {LessPlugin}
 */

function createWebpackLessPlugin(loaderContext, implementation) {
  const resolve = loaderContext.getResolve({
    dependencyType: "less",
    conditionNames: ["less", "style"],
    mainFields: ["less", "style", "main", "..."],
    mainFiles: ["index", "..."],
    extensions: [".less", ".css"],
    preferRelative: true
  });

  class WebpackFileManager extends implementation.FileManager {
    supports(filename) {
      if (filename[0] === "/" || IS_NATIVE_WIN32_PATH.test(filename)) {
        return true;
      }

      if (this.isPathAbsolute(filename)) {
        return false;
      }

      return true;
    } // Sync resolving is used at least by the `data-uri` function.
    // This file manager doesn't know how to do it, so let's delegate it
    // to the default file manager of Less.
    // We could probably use loaderContext.resolveSync, but it's deprecated,
    // see https://webpack.js.org/api/loaders/#this-resolvesync


    supportsSync() {
      return false;
    }

    async resolveFilename(filename, currentDirectory) {
      // Less is giving us trailing slashes, but the context should have no trailing slash
      const context = currentDirectory.replace(trailingSlash, "");
      let request = filename; // A `~` makes the url an module

      if (MODULE_REQUEST_REGEX.test(filename)) {
        request = request.replace(MODULE_REQUEST_REGEX, "");
      }

      if (IS_MODULE_IMPORT.test(filename)) {
        request = request[request.length - 1] === "/" ? request : `${request}/`;
      }

      return this.resolveRequests(context, [...new Set([request, filename])]);
    }

    async resolveRequests(context, possibleRequests) {
      if (possibleRequests.length === 0) {
        return Promise.reject();
      }

      let result;

      try {
        result = await resolve(context, possibleRequests[0]);
      } catch (error) {
        const [, ...tailPossibleRequests] = possibleRequests;

        if (tailPossibleRequests.length === 0) {
          throw error;
        }

        result = await this.resolveRequests(context, tailPossibleRequests);
      }

      return result;
    }

    async loadFile(filename, ...args) {
      let result;

      try {
        if (IS_SPECIAL_MODULE_IMPORT.test(filename)) {
          const error = new Error();
          error.type = "Next";
          throw error;
        }

        result = await super.loadFile(filename, ...args);
      } catch (error) {
        if (error.type !== "File" && error.type !== "Next") {
          return Promise.reject(error);
        }

        try {
          result = await this.resolveFilename(filename, ...args);
        } catch (webpackResolveError) {
          error.message = `Less resolver error:\n${error.message}\n\n` + `Webpack resolver error details:\n${webpackResolveError.details}\n\n` + `Webpack resolver error missing:\n${webpackResolveError.missing}\n\n`;
          return Promise.reject(error);
        }

        loaderContext.addDependency(result);
        return super.loadFile(result, ...args);
      }

      loaderContext.addDependency(_path.default.normalize(result.filename));
      return result;
    }

  }

  return {
    install(lessInstance, pluginManager) {
      pluginManager.addFileManager(new WebpackFileManager());
    },

    minVersion: [3, 0, 0]
  };
}
/**
 * Get the less options from the loader context and normalizes its values
 *
 * @param {object} loaderContext
 * @param {object} loaderOptions
 * @param {object} implementation
 * @returns {Object}
 */


function getLessOptions(loaderContext, loaderOptions, implementation) {
  const options = (0, _full.klona)(typeof loaderOptions.lessOptions === "function" ? loaderOptions.lessOptions(loaderContext) || {} : loaderOptions.lessOptions || {});
  const lessOptions = {
    plugins: [],
    relativeUrls: true,
    // We need to set the filename because otherwise our WebpackFileManager will receive an undefined path for the entry
    filename: loaderContext.resourcePath,
    ...options
  };
  const shouldUseWebpackImporter = typeof loaderOptions.webpackImporter === "boolean" ? loaderOptions.webpackImporter : true;

  if (shouldUseWebpackImporter) {
    lessOptions.plugins.unshift(createWebpackLessPlugin(loaderContext, implementation));
  }

  lessOptions.plugins.unshift({
    install(lessProcessor, pluginManager) {
      // eslint-disable-next-line no-param-reassign
      pluginManager.webpackLoaderContext = loaderContext;
      lessOptions.pluginManager = pluginManager;
    }

  });
  return lessOptions;
}

function isUnsupportedUrl(url) {
  // Is Windows path
  if (IS_NATIVE_WIN32_PATH.test(url)) {
    return false;
  } // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
  // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3


  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

function normalizeSourceMap(map) {
  const newMap = map; // map.file is an optional property that provides the output filename.
  // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
  // eslint-disable-next-line no-param-reassign

  delete newMap.file; // eslint-disable-next-line no-param-reassign

  newMap.sourceRoot = ""; // `less` returns POSIX paths, that's why we need to transform them back to native paths.
  // eslint-disable-next-line no-param-reassign

  newMap.sources = newMap.sources.map(source => _path.default.normalize(source));
  return newMap;
}

function getLessImplementation(loaderContext, implementation) {
  let resolvedImplementation = implementation;

  if (!implementation || typeof implementation === "string") {
    const lessImplPkg = implementation || "less";

    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      resolvedImplementation = require(lessImplPkg);
    } catch (error) {
      loaderContext.emitError(error); // eslint-disable-next-line consistent-return

      return;
    }
  } // eslint-disable-next-line consistent-return


  return resolvedImplementation;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCompileFn = getCompileFn;
exports.getModernWebpackImporter = getModernWebpackImporter;
exports.getSassImplementation = getSassImplementation;
exports.getSassOptions = getSassOptions;
exports.getWebpackImporter = getWebpackImporter;
exports.getWebpackResolver = getWebpackResolver;
exports.isSupportedFibers = isSupportedFibers;
exports.normalizeSourceMap = normalizeSourceMap;

var _url = _interopRequireDefault(require("url"));

var _path = _interopRequireDefault(require("path"));

var _full = require("klona/full");

var _neoAsync = _interopRequireDefault(require("neo-async"));

var _SassWarning = _interopRequireDefault(require("./SassWarning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDefaultSassImplementation() {
  let sassImplPkg = "sass";

  try {
    require.resolve("sass");
  } catch (ignoreError) {
    try {
      require.resolve("node-sass");

      sassImplPkg = "node-sass";
    } catch (_ignoreError) {
      try {
        require.resolve("sass-embedded");

        sassImplPkg = "sass-embedded";
      } catch (__ignoreError) {
        sassImplPkg = "sass";
      }
    }
  } // eslint-disable-next-line import/no-dynamic-require, global-require


  return require(sassImplPkg);
}
/**
 * This function is not Webpack-specific and can be used by tools wishing to mimic `sass-loader`'s behaviour, so its signature should not be changed.
 */


function getSassImplementation(loaderContext, implementation) {
  let resolvedImplementation = implementation;

  if (!resolvedImplementation) {
    try {
      resolvedImplementation = getDefaultSassImplementation();
    } catch (error) {
      loaderContext.emitError(error);
      return;
    }
  }

  if (typeof resolvedImplementation === "string") {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      resolvedImplementation = require(resolvedImplementation);
    } catch (error) {
      loaderContext.emitError(error); // eslint-disable-next-line consistent-return

      return;
    }
  }

  const {
    info
  } = resolvedImplementation;

  if (!info) {
    loaderContext.emitError(new Error("Unknown Sass implementation."));
    return;
  }

  const infoParts = info.split("\t");

  if (infoParts.length < 2) {
    loaderContext.emitError(new Error(`Unknown Sass implementation "${info}".`));
    return;
  }

  const [implementationName] = infoParts;

  if (implementationName === "dart-sass") {
    // eslint-disable-next-line consistent-return
    return resolvedImplementation;
  } else if (implementationName === "node-sass") {
    // eslint-disable-next-line consistent-return
    return resolvedImplementation;
  } else if (implementationName === "sass-embedded") {
    // eslint-disable-next-line consistent-return
    return resolvedImplementation;
  }

  loaderContext.emitError(new Error(`Unknown Sass implementation "${implementationName}".`));
}
/**
 * @param {any} loaderContext
 * @returns {boolean}
 */


function isProductionLikeMode(loaderContext) {
  return loaderContext.mode === "production" || !loaderContext.mode;
}

function proxyCustomImporters(importers, loaderContext) {
  return [].concat(importers).map(importer => function proxyImporter(...args) {
    const self = { ...this,
      webpackLoaderContext: loaderContext
    };
    return importer.apply(self, args);
  });
}

function isSupportedFibers() {
  const [nodeVersion] = process.versions.node.split(".");
  return Number(nodeVersion) < 16;
}
/**
 * Derives the sass options from the loader context and normalizes its values with sane defaults.
 *
 * @param {object} loaderContext
 * @param {object} loaderOptions
 * @param {string} content
 * @param {object} implementation
 * @param {boolean} useSourceMap
 * @returns {Object}
 */


async function getSassOptions(loaderContext, loaderOptions, content, implementation, useSourceMap) {
  const options = (0, _full.klona)(loaderOptions.sassOptions ? typeof loaderOptions.sassOptions === "function" ? loaderOptions.sassOptions(loaderContext) || {} : loaderOptions.sassOptions : {});
  const isDartSass = implementation.info.includes("dart-sass");
  const isModernAPI = loaderOptions.api === "modern";
  options.data = loaderOptions.additionalData ? typeof loaderOptions.additionalData === "function" ? await loaderOptions.additionalData(content, loaderContext) : `${loaderOptions.additionalData}\n${content}` : content;

  if (!options.logger) {
    // TODO set me to `true` by default in the next major release
    const needEmitWarning = loaderOptions.warnRuleAsWarning === true;
    const logger = loaderContext.getLogger("sass-loader");

    const formatSpan = span => `${span.url || "-"}:${span.start.line}:${span.start.column}: `;

    options.logger = {
      debug(message, loggerOptions) {
        let builtMessage = "";

        if (loggerOptions.span) {
          builtMessage = formatSpan(loggerOptions.span);
        }

        builtMessage += message;
        logger.debug(builtMessage);
      },

      warn(message, loggerOptions) {
        let builtMessage = "";

        if (loggerOptions.deprecation) {
          builtMessage += "Deprecation ";
        }

        if (loggerOptions.span && !loggerOptions.stack) {
          builtMessage = formatSpan(loggerOptions.span);
        }

        builtMessage += message;

        if (loggerOptions.stack) {
          builtMessage += `\n\n${loggerOptions.stack}`;
        }

        if (needEmitWarning) {
          loaderContext.emitWarning(new _SassWarning.default(builtMessage, loggerOptions));
        } else {
          logger.warn(builtMessage);
        }
      }

    };
  }

  const {
    resourcePath
  } = loaderContext;

  if (isModernAPI) {
    options.url = _url.default.pathToFileURL(resourcePath); // opt.outputStyle

    if (!options.style && isProductionLikeMode(loaderContext)) {
      options.style = "compressed";
    }

    if (useSourceMap) {
      options.sourceMap = true;
    } // If we are compiling sass and indentedSyntax isn't set, automatically set it.


    if (typeof options.syntax === "undefined") {
      const ext = _path.default.extname(resourcePath);

      if (ext && ext.toLowerCase() === ".scss") {
        options.syntax = "scss";
      } else if (ext && ext.toLowerCase() === ".sass") {
        options.syntax = "indented";
      } else if (ext && ext.toLowerCase() === ".css") {
        options.syntax = "css";
      }
    }

    options.importers = options.importers ? proxyCustomImporters(Array.isArray(options.importers) ? options.importers : [options.importers], loaderContext) : [];
  } else {
    options.file = resourcePath;

    if (isDartSass && isSupportedFibers()) {
      const shouldTryToResolveFibers = !options.fiber && options.fiber !== false;

      if (shouldTryToResolveFibers) {
        let fibers;

        try {
          fibers = require.resolve("fibers");
        } catch (_error) {// Nothing
        }

        if (fibers) {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          options.fiber = require(fibers);
        }
      } else if (options.fiber === false) {
        // Don't pass the `fiber` option for `sass` (`Dart Sass`)
        delete options.fiber;
      }
    } else {
      // Don't pass the `fiber` option for `node-sass`
      delete options.fiber;
    } // opt.outputStyle


    if (!options.outputStyle && isProductionLikeMode(loaderContext)) {
      options.outputStyle = "compressed";
    }

    if (useSourceMap) {
      // Deliberately overriding the sourceMap option here.
      // node-sass won't produce source maps if the data option is used and options.sourceMap is not a string.
      // In case it is a string, options.sourceMap should be a path where the source map is written.
      // But since we're using the data option, the source map will not actually be written, but
      // all paths in sourceMap.sources will be relative to that path.
      // Pretty complicated... :(
      options.sourceMap = true;
      options.outFile = _path.default.join(loaderContext.rootContext, "style.css.map");
      options.sourceMapContents = true;
      options.omitSourceMapUrl = true;
      options.sourceMapEmbed = false;
    }

    const ext = _path.default.extname(resourcePath); // If we are compiling sass and indentedSyntax isn't set, automatically set it.


    if (ext && ext.toLowerCase() === ".sass" && typeof options.indentedSyntax === "undefined") {
      options.indentedSyntax = true;
    } else {
      options.indentedSyntax = Boolean(options.indentedSyntax);
    } // Allow passing custom importers to `sass`/`node-sass`. Accepts `Function` or an array of `Function`s.


    options.importer = options.importer ? proxyCustomImporters(Array.isArray(options.importer) ? options.importer : [options.importer], loaderContext) : [];
    options.includePaths = [].concat(process.cwd()).concat( // We use `includePaths` in context for resolver, so it should be always absolute
    (options.includePaths || []).map(includePath => _path.default.isAbsolute(includePath) ? includePath : _path.default.join(process.cwd(), includePath))).concat(process.env.SASS_PATH ? process.env.SASS_PATH.split(process.platform === "win32" ? ";" : ":") : []);

    if (typeof options.charset === "undefined") {
      options.charset = true;
    }
  }

  return options;
}

const MODULE_REQUEST_REGEX = /^[^?]*~/; // Examples:
// - ~package
// - ~package/
// - ~@org
// - ~@org/
// - ~@org/package
// - ~@org/package/

const IS_MODULE_IMPORT = /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/;
/**
 * When `sass`/`node-sass` tries to resolve an import, it uses a special algorithm.
 * Since the `sass-loader` uses webpack to resolve the modules, we need to simulate that algorithm.
 * This function returns an array of import paths to try.
 * The last entry in the array is always the original url to enable straight-forward webpack.config aliases.
 *
 * We don't need emulate `dart-sass` "It's not clear which file to import." errors (when "file.ext" and "_file.ext" files are present simultaneously in the same directory).
 * This reduces performance and `dart-sass` always do it on own side.
 *
 * @param {string} url
 * @param {boolean} forWebpackResolver
 * @param {boolean} fromImport
 * @returns {Array<string>}
 */

function getPossibleRequests( // eslint-disable-next-line no-shadow
url, forWebpackResolver = false, fromImport = false) {
  let request = url; // In case there is module request, send this to webpack resolver

  if (forWebpackResolver) {
    if (MODULE_REQUEST_REGEX.test(url)) {
      request = request.replace(MODULE_REQUEST_REGEX, "");
    }

    if (IS_MODULE_IMPORT.test(url)) {
      request = request[request.length - 1] === "/" ? request : `${request}/`;
      return [...new Set([request, url])];
    }
  } // Keep in mind: ext can also be something like '.datepicker' when the true extension is omitted and the filename contains a dot.
  // @see https://github.com/webpack-contrib/sass-loader/issues/167


  const extension = _path.default.extname(request).toLowerCase(); // Because @import is also defined in CSS, Sass needs a way of compiling plain CSS @imports without trying to import the files at compile time.
  // To accomplish this, and to ensure SCSS is as much of a superset of CSS as possible, Sass will compile any @imports with the following characteristics to plain CSS imports:
  //  - imports where the URL ends with .css.
  //  - imports where the URL begins http:// or https://.
  //  - imports where the URL is written as a url().
  //  - imports that have media queries.
  //
  // The `node-sass` package sends `@import` ending on `.css` to importer, it is bug, so we skip resolve


  if (extension === ".css") {
    return [];
  }

  const dirname = _path.default.dirname(request);

  const normalizedDirname = dirname === "." ? "" : `${dirname}/`;

  const basename = _path.default.basename(request);

  const basenameWithoutExtension = _path.default.basename(request, extension);

  return [...new Set([].concat(fromImport ? [`${normalizedDirname}_${basenameWithoutExtension}.import${extension}`, `${normalizedDirname}${basenameWithoutExtension}.import${extension}`] : []).concat([`${normalizedDirname}_${basename}`, `${normalizedDirname}${basename}`]).concat(forWebpackResolver ? [url] : []))];
}

function promiseResolve(callbackResolve) {
  return (context, request) => new Promise((resolve, reject) => {
    callbackResolve(context, request, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

async function startResolving(resolutionMap) {
  if (resolutionMap.length === 0) {
    return Promise.reject();
  }

  const [{
    possibleRequests
  }] = resolutionMap;

  if (possibleRequests.length === 0) {
    return Promise.reject();
  }

  const [{
    resolve,
    context
  }] = resolutionMap;

  try {
    return await resolve(context, possibleRequests[0]);
  } catch (_ignoreError) {
    const [, ...tailResult] = possibleRequests;

    if (tailResult.length === 0) {
      const [, ...tailResolutionMap] = resolutionMap;
      return startResolving(tailResolutionMap);
    } // eslint-disable-next-line no-param-reassign


    resolutionMap[0].possibleRequests = tailResult;
    return startResolving(resolutionMap);
  }
}

const IS_SPECIAL_MODULE_IMPORT = /^~[^/]+$/; // `[drive_letter]:\` + `\\[server]\[sharename]\`

const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;
/**
 * @public
 * Create the resolve function used in the custom Sass importer.
 *
 * Can be used by external tools to mimic how `sass-loader` works, for example
 * in a Jest transform. Such usages will want to wrap `resolve.create` from
 * [`enhanced-resolve`]{@link https://github.com/webpack/enhanced-resolve} to
 * pass as the `resolverFactory` argument.
 *
 * @param {Function} resolverFactory - A factory function for creating a Webpack
 *   resolver.
 * @param {Object} implementation - The imported Sass implementation, both
 *   `sass` (Dart Sass) and `node-sass` are supported.
 * @param {string[]} [includePaths] - The list of include paths passed to Sass.
 *
 * @throws If a compatible Sass implementation cannot be found.
 */

function getWebpackResolver(resolverFactory, implementation, includePaths = []) {
  const isDartSass = implementation && implementation.info.includes("dart-sass"); // We only have one difference with the built-in sass resolution logic and out resolution logic:
  // First, we look at the files starting with `_`, then without `_` (i.e. `_name.sass`, `_name.scss`, `_name.css`, `name.sass`, `name.scss`, `name.css`),
  // although `sass` look together by extensions (i.e. `_name.sass`/`name.sass`/`_name.scss`/`name.scss`/`_name.css`/`name.css`).
  // It shouldn't be a problem because `sass` throw errors:
  // - on having `_name.sass` and `name.sass` (extension can be `sass`, `scss` or `css`) in the same directory
  // - on having `_name.sass` and `_name.scss` in the same directory
  //
  // Also `sass` prefer `sass`/`scss` over `css`.

  const sassModuleResolve = promiseResolve(resolverFactory({
    alias: [],
    aliasFields: [],
    conditionNames: [],
    descriptionFiles: [],
    extensions: [".sass", ".scss", ".css"],
    exportsFields: [],
    mainFields: [],
    mainFiles: ["_index", "index"],
    modules: [],
    restrictions: [/\.((sa|sc|c)ss)$/i],
    preferRelative: true
  }));
  const sassImportResolve = promiseResolve(resolverFactory({
    alias: [],
    aliasFields: [],
    conditionNames: [],
    descriptionFiles: [],
    extensions: [".sass", ".scss", ".css"],
    exportsFields: [],
    mainFields: [],
    mainFiles: ["_index.import", "_index", "index.import", "index"],
    modules: [],
    restrictions: [/\.((sa|sc|c)ss)$/i],
    preferRelative: true
  }));
  const webpackModuleResolve = promiseResolve(resolverFactory({
    dependencyType: "sass",
    conditionNames: ["sass", "style"],
    mainFields: ["sass", "style", "main", "..."],
    mainFiles: ["_index", "index", "..."],
    extensions: [".sass", ".scss", ".css"],
    restrictions: [/\.((sa|sc|c)ss)$/i],
    preferRelative: true
  }));
  const webpackImportResolve = promiseResolve(resolverFactory({
    dependencyType: "sass",
    conditionNames: ["sass", "style"],
    mainFields: ["sass", "style", "main", "..."],
    mainFiles: ["_index.import", "_index", "index.import", "index", "..."],
    extensions: [".sass", ".scss", ".css"],
    restrictions: [/\.((sa|sc|c)ss)$/i],
    preferRelative: true
  }));
  return (context, request, fromImport) => {
    // See https://github.com/webpack/webpack/issues/12340
    // Because `node-sass` calls our importer before `1. Filesystem imports relative to the base file.`
    // custom importer may not return `{ file: '/path/to/name.ext' }` and therefore our `context` will be relative
    if (!isDartSass && !_path.default.isAbsolute(context)) {
      return Promise.reject();
    }

    const originalRequest = request;
    const isFileScheme = originalRequest.slice(0, 5).toLowerCase() === "file:";

    if (isFileScheme) {
      try {
        // eslint-disable-next-line no-param-reassign
        request = _url.default.fileURLToPath(originalRequest);
      } catch (ignoreError) {
        // eslint-disable-next-line no-param-reassign
        request = request.slice(7);
      }
    }

    let resolutionMap = [];
    const needEmulateSassResolver = // `sass` doesn't support module import
    !IS_SPECIAL_MODULE_IMPORT.test(request) && // We need improve absolute paths handling.
    // Absolute paths should be resolved:
    // - Server-relative URLs - `<context>/path/to/file.ext` (where `<context>` is root context)
    // - Absolute path - `/full/path/to/file.ext` or `C:\\full\path\to\file.ext`
    !isFileScheme && !originalRequest.startsWith("/") && !IS_NATIVE_WIN32_PATH.test(originalRequest);

    if (includePaths.length > 0 && needEmulateSassResolver) {
      // The order of import precedence is as follows:
      //
      // 1. Filesystem imports relative to the base file.
      // 2. Custom importer imports.
      // 3. Filesystem imports relative to the working directory.
      // 4. Filesystem imports relative to an `includePaths` path.
      // 5. Filesystem imports relative to a `SASS_PATH` path.
      //
      // `sass` run custom importers before `3`, `4` and `5` points, we need to emulate this behavior to avoid wrong resolution.
      const sassPossibleRequests = getPossibleRequests(request, false, fromImport); // `node-sass` calls our importer before `1. Filesystem imports relative to the base file.`, so we need emulate this too

      if (!isDartSass) {
        resolutionMap = resolutionMap.concat({
          resolve: fromImport ? sassImportResolve : sassModuleResolve,
          context: _path.default.dirname(context),
          possibleRequests: sassPossibleRequests
        });
      }

      resolutionMap = resolutionMap.concat( // eslint-disable-next-line no-shadow
      includePaths.map(context => {
        return {
          resolve: fromImport ? sassImportResolve : sassModuleResolve,
          context,
          possibleRequests: sassPossibleRequests
        };
      }));
    }

    const webpackPossibleRequests = getPossibleRequests(request, true, fromImport);
    resolutionMap = resolutionMap.concat({
      resolve: fromImport ? webpackImportResolve : webpackModuleResolve,
      context: _path.default.dirname(context),
      possibleRequests: webpackPossibleRequests
    });
    return startResolving(resolutionMap);
  };
}

const MATCH_CSS = /\.css$/i;

function getModernWebpackImporter() {
  return {
    async canonicalize() {
      return null;
    },

    load() {// TODO implement
    }

  };
}

function getWebpackImporter(loaderContext, implementation, includePaths) {
  const resolve = getWebpackResolver(loaderContext.getResolve, implementation, includePaths);
  return function importer(originalUrl, prev, done) {
    const {
      fromImport
    } = this;
    resolve(prev, originalUrl, fromImport).then(result => {
      // Add the result as dependency.
      // Although we're also using stats.includedFiles, this might come in handy when an error occurs.
      // In this case, we don't get stats.includedFiles from node-sass/sass.
      loaderContext.addDependency(_path.default.normalize(result)); // By removing the CSS file extension, we trigger node-sass to include the CSS file instead of just linking it.

      done({
        file: result.replace(MATCH_CSS, "")
      });
    }) // Catch all resolving errors, return the original file and pass responsibility back to other custom importers
    .catch(() => {
      done({
        file: originalUrl
      });
    });
  };
}

let nodeSassJobQueue = null;
/**
 * Verifies that the implementation and version of Sass is supported by this loader.
 *
 * @param {Object} implementation
 * @param {Object} options
 * @returns {Function}
 */

function getCompileFn(implementation, options) {
  const isNewSass = implementation.info.includes("dart-sass") || implementation.info.includes("sass-embedded");

  if (isNewSass) {
    if (options.api === "modern") {
      return sassOptions => {
        const {
          data,
          ...rest
        } = sassOptions;
        return implementation.compileStringAsync(data, rest);
      };
    }

    return sassOptions => new Promise((resolve, reject) => {
      implementation.render(sassOptions, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  if (options.api === "modern") {
    throw new Error("Modern API is not supported for 'node-sass'");
  } // There is an issue with node-sass when async custom importers are used
  // See https://github.com/sass/node-sass/issues/857#issuecomment-93594360
  // We need to use a job queue to make sure that one thread is always available to the UV lib


  if (nodeSassJobQueue === null) {
    const threadPoolSize = Number(process.env.UV_THREADPOOL_SIZE || 4);
    nodeSassJobQueue = _neoAsync.default.queue(implementation.render.bind(implementation), threadPoolSize - 1);
  }

  return sassOptions => new Promise((resolve, reject) => {
    nodeSassJobQueue.push.bind(nodeSassJobQueue)(sassOptions, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
}

const ABSOLUTE_SCHEME = /^[A-Za-z0-9+\-.]+:/;
/**
 * @param {string} source
 * @returns {"absolute" | "scheme-relative" | "path-absolute" | "path-absolute"}
 */

function getURLType(source) {
  if (source[0] === "/") {
    if (source[1] === "/") {
      return "scheme-relative";
    }

    return "path-absolute";
  }

  if (IS_NATIVE_WIN32_PATH.test(source)) {
    return "path-absolute";
  }

  return ABSOLUTE_SCHEME.test(source) ? "absolute" : "path-relative";
}

function normalizeSourceMap(map, rootContext) {
  const newMap = map; // result.map.file is an optional property that provides the output filename.
  // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
  // eslint-disable-next-line no-param-reassign

  if (typeof newMap.file !== "undefined") {
    delete newMap.file;
  } // eslint-disable-next-line no-param-reassign


  newMap.sourceRoot = ""; // node-sass returns POSIX paths, that's why we need to transform them back to native paths.
  // This fixes an error on windows where the source-map module cannot resolve the source maps.
  // @see https://github.com/webpack-contrib/sass-loader/issues/366#issuecomment-279460722
  // eslint-disable-next-line no-param-reassign

  newMap.sources = newMap.sources.map(source => {
    const sourceType = getURLType(source); // Do no touch `scheme-relative`, `path-absolute` and `absolute` types (except `file:`)

    if (sourceType === "absolute" && /^file:/i.test(source)) {
      return _url.default.fileURLToPath(source);
    } else if (sourceType === "path-relative") {
      return _path.default.resolve(rootContext, _path.default.normalize(source));
    }

    return source;
  });
  return newMap;
}
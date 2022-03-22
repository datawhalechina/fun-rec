"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFromURL = fetchFromURL;
exports.flattenSourceMap = flattenSourceMap;
exports.getSourceMappingURL = getSourceMappingURL;

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

var _sourceMapJs = _interopRequireDefault(require("source-map-js"));

var _iconvLite = require("iconv-lite");

var _parseDataUrl = _interopRequireDefault(require("./parse-data-url"));

var _labelsToNames = _interopRequireDefault(require("./labels-to-names"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Matches only the last occurrence of sourceMappingURL
const innerRegex = /\s*[#@]\s*sourceMappingURL\s*=\s*([^\s'"]*)\s*/;
/* eslint-disable prefer-template */

const sourceMappingURLRegex = RegExp("(?:" + "/\\*" + "(?:\\s*\r?\n(?://)?)?" + "(?:" + innerRegex.source + ")" + "\\s*" + "\\*/" + "|" + "//(?:" + innerRegex.source + ")" + ")" + "\\s*");
/* eslint-enable prefer-template */

function labelToName(label) {
  const labelLowercase = String(label).trim().toLowerCase();
  return _labelsToNames.default[labelLowercase] || null;
}

async function flattenSourceMap(map) {
  const consumer = await new _sourceMapJs.default.SourceMapConsumer(map);
  const generatedMap = map.file ? new _sourceMapJs.default.SourceMapGenerator({
    file: map.file
  }) : new _sourceMapJs.default.SourceMapGenerator();
  consumer.sources.forEach(sourceFile => {
    const sourceContent = consumer.sourceContentFor(sourceFile, true);
    generatedMap.setSourceContent(sourceFile, sourceContent);
  });
  consumer.eachMapping(mapping => {
    const {
      source
    } = consumer.originalPositionFor({
      line: mapping.generatedLine,
      column: mapping.generatedColumn
    });
    const mappings = {
      source,
      original: {
        line: mapping.originalLine,
        column: mapping.originalColumn
      },
      generated: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      }
    };

    if (source) {
      generatedMap.addMapping(mappings);
    }
  });
  return generatedMap.toJSON();
}

function getSourceMappingURL(code) {
  const lines = code.split(/^/m);
  let match;

  for (let i = lines.length - 1; i >= 0; i--) {
    match = lines[i].match(sourceMappingURLRegex);

    if (match) {
      break;
    }
  }

  const sourceMappingURL = match ? match[1] || match[2] || "" : null;
  return {
    sourceMappingURL: sourceMappingURL ? decodeURI(sourceMappingURL) : sourceMappingURL,
    replacementString: match ? match[0] : null
  };
}

function getAbsolutePath(context, request, sourceRoot) {
  if (sourceRoot) {
    if (_path.default.isAbsolute(sourceRoot)) {
      return _path.default.join(sourceRoot, request);
    }

    return _path.default.join(context, sourceRoot, request);
  }

  return _path.default.join(context, request);
}

function fetchFromDataURL(loaderContext, sourceURL) {
  const dataURL = (0, _parseDataUrl.default)(sourceURL);

  if (dataURL) {
    // https://tools.ietf.org/html/rfc4627
    // JSON text SHALL be encoded in Unicode. The default encoding is UTF-8.
    const encodingName = labelToName(dataURL.parameters.get("charset")) || "UTF-8";
    return (0, _iconvLite.decode)(dataURL.body, encodingName);
  }

  throw new Error(`Failed to parse source map from "data" URL: ${sourceURL}`);
}

async function fetchFromFilesystem(loaderContext, sourceURL) {
  let buffer;

  try {
    buffer = await new Promise((resolve, reject) => {
      loaderContext.fs.readFile(sourceURL, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  } catch (error) {
    throw new Error(`Failed to parse source map from '${sourceURL}' file: ${error}`);
  }

  return {
    path: sourceURL,
    data: buffer.toString()
  };
}

async function fetchPathsFromFilesystem(loaderContext, possibleRequests, errorsAccumulator = "") {
  let result;

  try {
    result = await fetchFromFilesystem(loaderContext, possibleRequests[0], errorsAccumulator);
  } catch (error) {
    // eslint-disable-next-line no-param-reassign
    errorsAccumulator += `${error.message}\n\n`;
    const [, ...tailPossibleRequests] = possibleRequests;

    if (tailPossibleRequests.length === 0) {
      error.message = errorsAccumulator;
      throw error;
    }

    return fetchPathsFromFilesystem(loaderContext, tailPossibleRequests, errorsAccumulator);
  }

  return result;
}

async function fetchFromURL(loaderContext, context, url, sourceRoot, skipReading = false) {
  // 1. It's an absolute url and it is not `windows` path like `C:\dir\file`
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !_path.default.win32.isAbsolute(url)) {
    const {
      protocol
    } = _url.default.parse(url);

    if (protocol === "data:") {
      if (skipReading) {
        return {
          sourceURL: ""
        };
      }

      const sourceContent = fetchFromDataURL(loaderContext, url);
      return {
        sourceURL: "",
        sourceContent
      };
    }

    if (skipReading) {
      return {
        sourceURL: url
      };
    }

    if (protocol === "file:") {
      const pathFromURL = _url.default.fileURLToPath(url);

      const sourceURL = _path.default.normalize(pathFromURL);

      const {
        data: sourceContent
      } = await fetchFromFilesystem(loaderContext, sourceURL);
      return {
        sourceURL,
        sourceContent
      };
    }

    throw new Error(`Failed to parse source map: '${url}' URL is not supported`);
  } // 2. It's a scheme-relative


  if (/^\/\//.test(url)) {
    throw new Error(`Failed to parse source map: '${url}' URL is not supported`);
  } // 3. Absolute path


  if (_path.default.isAbsolute(url)) {
    let sourceURL = _path.default.normalize(url);

    let sourceContent;

    if (!skipReading) {
      const possibleRequests = [sourceURL];

      if (url.startsWith("/")) {
        possibleRequests.push(getAbsolutePath(context, sourceURL.slice(1), sourceRoot));
      }

      const result = await fetchPathsFromFilesystem(loaderContext, possibleRequests);
      sourceURL = result.path;
      sourceContent = result.data;
    }

    return {
      sourceURL,
      sourceContent
    };
  } // 4. Relative path


  const sourceURL = getAbsolutePath(context, url, sourceRoot);
  let sourceContent;

  if (!skipReading) {
    const {
      data
    } = await fetchFromFilesystem(loaderContext, sourceURL);
    sourceContent = data;
  }

  return {
    sourceURL,
    sourceContent
  };
}
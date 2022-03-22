"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;

var _path = _interopRequireDefault(require("path"));

var _options = _interopRequireDefault(require("./options.json"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
async function loader(input, inputMap) {
  const options = this.getOptions(_options.default);
  const {
    sourceMappingURL,
    replacementString
  } = (0, _utils.getSourceMappingURL)(input);
  const callback = this.async();

  if (!sourceMappingURL) {
    callback(null, input, inputMap);
    return;
  }

  let behaviourSourceMappingUrl;

  try {
    behaviourSourceMappingUrl = typeof options.filterSourceMappingUrl !== "undefined" ? options.filterSourceMappingUrl(sourceMappingURL, this.resourcePath) : "consume";
  } catch (error) {
    callback(error);
    return;
  } // eslint-disable-next-line default-case


  switch (behaviourSourceMappingUrl) {
    case "skip":
      callback(null, input, inputMap);
      return;

    case false:
    case "remove":
      callback(null, input.replace(replacementString, ""), inputMap);
      return;
  }

  let sourceURL;
  let sourceContent;

  try {
    ({
      sourceURL,
      sourceContent
    } = await (0, _utils.fetchFromURL)(this, this.context, sourceMappingURL));
  } catch (error) {
    this.emitWarning(error);
    callback(null, input, inputMap);
    return;
  }

  if (sourceURL) {
    this.addDependency(sourceURL);
  }

  let map;

  try {
    map = JSON.parse(sourceContent.replace(/^\)\]\}'/, ""));
  } catch (parseError) {
    this.emitWarning(new Error(`Failed to parse source map from '${sourceMappingURL}': ${parseError}`));
    callback(null, input, inputMap);
    return;
  }

  const context = sourceURL ? _path.default.dirname(sourceURL) : this.context;

  if (map.sections) {
    // eslint-disable-next-line no-param-reassign
    map = await (0, _utils.flattenSourceMap)(map);
  }

  const resolvedSources = await Promise.all(map.sources.map(async (source, i) => {
    // eslint-disable-next-line no-shadow
    let sourceURL; // eslint-disable-next-line no-shadow

    let sourceContent;
    const originalSourceContent = map.sourcesContent && typeof map.sourcesContent[i] !== "undefined" && map.sourcesContent[i] !== null ? map.sourcesContent[i] : // eslint-disable-next-line no-undefined
    undefined;
    const skipReading = typeof originalSourceContent !== "undefined";
    let errored = false; // We do not skipReading here, because we need absolute paths in sources.
    // This is necessary so that for sourceMaps with the same file structure in sources, name collisions do not occur.
    // https://github.com/webpack-contrib/source-map-loader/issues/51

    try {
      ({
        sourceURL,
        sourceContent
      } = await (0, _utils.fetchFromURL)(this, context, source, map.sourceRoot, skipReading));
    } catch (error) {
      errored = true;
      this.emitWarning(error);
    }

    if (skipReading) {
      sourceContent = originalSourceContent;
    } else if (!errored && sourceURL) {
      this.addDependency(sourceURL);
    } // Return original value of `source` when error happens


    return {
      sourceURL: errored ? source : sourceURL,
      sourceContent
    };
  }));
  const newMap = { ...map
  };
  newMap.sources = [];
  newMap.sourcesContent = [];
  delete newMap.sourceRoot;
  resolvedSources.forEach(source => {
    // eslint-disable-next-line no-shadow
    const {
      sourceURL,
      sourceContent
    } = source;
    newMap.sources.push(sourceURL || "");
    newMap.sourcesContent.push(sourceContent || "");
  });
  const sourcesContentIsEmpty = newMap.sourcesContent.filter(entry => Boolean(entry)).length === 0;

  if (sourcesContentIsEmpty) {
    delete newMap.sourcesContent;
  }

  callback(null, input.replace(replacementString, ""), newMap);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportLazyStyleCode = getExportLazyStyleCode;
exports.getExportStyleCode = getExportStyleCode;
exports.getImportInsertBySelectorCode = getImportInsertBySelectorCode;
exports.getImportInsertStyleElementCode = getImportInsertStyleElementCode;
exports.getImportIsOldIECode = getImportIsOldIECode;
exports.getImportLinkAPICode = getImportLinkAPICode;
exports.getImportLinkContentCode = getImportLinkContentCode;
exports.getImportStyleAPICode = getImportStyleAPICode;
exports.getImportStyleContentCode = getImportStyleContentCode;
exports.getImportStyleDomAPICode = getImportStyleDomAPICode;
exports.getInsertOptionCode = getInsertOptionCode;
exports.getLinkHmrCode = getLinkHmrCode;
exports.getSetAttributesCode = getSetAttributesCode;
exports.getStyleHmrCode = getStyleHmrCode;
exports.getStyleTagTransformFn = getStyleTagTransformFn;
exports.getStyleTagTransformFnCode = getStyleTagTransformFnCode;
exports.getdomAPI = getdomAPI;
exports.stringifyRequest = stringifyRequest;

var _path = _interopRequireDefault(require("path"));

var _isEqualLocals = _interopRequireDefault(require("./runtime/isEqualLocals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const matchRelativePath = /^\.\.?[/\\]/;

function isAbsolutePath(str) {
  return _path.default.posix.isAbsolute(str) || _path.default.win32.isAbsolute(str);
}

function isRelativePath(str) {
  return matchRelativePath.test(str);
} // TODO simplify for the next major release


function stringifyRequest(loaderContext, request) {
  if (typeof loaderContext.utils !== "undefined" && typeof loaderContext.utils.contextify === "function") {
    return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request));
  }

  const splitted = request.split("!");
  const {
    context
  } = loaderContext;
  return JSON.stringify(splitted.map(part => {
    // First, separate singlePath from query, because the query might contain paths again
    const splittedPart = part.match(/^(.*?)(\?.*)/);
    const query = splittedPart ? splittedPart[2] : "";
    let singlePath = splittedPart ? splittedPart[1] : part;

    if (isAbsolutePath(singlePath) && context) {
      singlePath = _path.default.relative(context, singlePath);

      if (isAbsolutePath(singlePath)) {
        // If singlePath still matches an absolute path, singlePath was on a different drive than context.
        // In this case, we leave the path platform-specific without replacing any separators.
        // @see https://github.com/webpack/loader-utils/pull/14
        return singlePath + query;
      }

      if (isRelativePath(singlePath) === false) {
        // Ensure that the relative path starts at least with ./ otherwise it would be a request into the modules directory (like node_modules).
        singlePath = `./${singlePath}`;
      }
    }

    return singlePath.replace(/\\/g, "/") + query;
  }).join("!"));
}

function getImportLinkAPICode(esModule, loaderContext) {
  const modulePath = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/injectStylesIntoLinkTag.js")}`);
  return esModule ? `import API from ${modulePath};` : `var API = require(${modulePath});`;
}

function getImportLinkContentCode(esModule, loaderContext, request) {
  const modulePath = stringifyRequest(loaderContext, `!!${request}`);
  return esModule ? `import content from ${modulePath};` : `var content = require(${modulePath});`;
}

function getImportStyleAPICode(esModule, loaderContext) {
  const modulePath = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/injectStylesIntoStyleTag.js")}`);
  return esModule ? `import API from ${modulePath};` : `var API = require(${modulePath});`;
}

function getImportStyleDomAPICode(esModule, loaderContext, isSingleton, isAuto) {
  const styleAPI = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/styleDomAPI.js")}`);
  const singletonAPI = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/singletonStyleDomAPI.js")}`);

  if (isAuto) {
    return esModule ? `import domAPI from ${styleAPI};
        import domAPISingleton from ${singletonAPI};` : `var domAPI = require(${styleAPI});
        var domAPISingleton = require(${singletonAPI});`;
  }

  return esModule ? `import domAPI from ${isSingleton ? singletonAPI : styleAPI};` : `var domAPI = require(${isSingleton ? singletonAPI : styleAPI});`;
}

function getImportStyleContentCode(esModule, loaderContext, request) {
  const modulePath = stringifyRequest(loaderContext, `!!${request}`);
  return esModule ? `import content, * as namedExport from ${modulePath};` : `var content = require(${modulePath});`;
}

function getImportInsertBySelectorCode(esModule, loaderContext, insertType, options) {
  if (insertType === "selector") {
    const modulePath = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/insertBySelector.js")}`);
    return esModule ? `import insertFn from ${modulePath};` : `var insertFn = require(${modulePath});`;
  }

  if (insertType === "module-path") {
    const modulePath = stringifyRequest(loaderContext, `${options.insert}`);
    loaderContext.addBuildDependency(options.insert);
    return esModule ? `import insertFn from ${modulePath};` : `var insertFn = require(${modulePath});`;
  }

  return "";
}

function getInsertOptionCode(insertType, options) {
  if (insertType === "selector") {
    const insert = options.insert ? JSON.stringify(options.insert) : '"head"';
    return `
      options.insert = insertFn.bind(null, ${insert});
    `;
  }

  if (insertType === "module-path") {
    return `options.insert = insertFn;`;
  } // Todo remove "function" type for insert option in next major release, because code duplication occurs. Leave require.resolve()


  return `options.insert = ${options.insert.toString()};`;
}

function getImportInsertStyleElementCode(esModule, loaderContext) {
  const modulePath = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/insertStyleElement.js")}`);
  return esModule ? `import insertStyleElement from ${modulePath};` : `var insertStyleElement = require(${modulePath});`;
}

function getStyleHmrCode(esModule, loaderContext, request, lazy) {
  const modulePath = stringifyRequest(loaderContext, `!!${request}`);
  return `
if (module.hot) {
  if (!content.locals || module.hot.invalidate) {
    var isEqualLocals = ${_isEqualLocals.default.toString()};
    var isNamedExport = ${esModule ? "!content.locals" : false};
    var oldLocals = isNamedExport ? namedExport : content.locals;

    module.hot.accept(
      ${modulePath},
      function () {
        ${esModule ? `if (!isEqualLocals(oldLocals, isNamedExport ? namedExport : content.locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? namedExport : content.locals;

              ${lazy ? `if (update && refs > 0) {
                      update(content);
                    }` : `update(content);`}` : `content = require(${modulePath});

              content = content.__esModule ? content.default : content;

              ${lazy ? "" : `if (typeof content === 'string') {
                      content = [[module.id, content, '']];
                    }`}

              if (!isEqualLocals(oldLocals, content.locals)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = content.locals;

              ${lazy ? `if (update && refs > 0) {
                        update(content);
                      }` : `update(content);`}`}
      }
    )
  }

  module.hot.dispose(function() {
    ${lazy ? `if (update) {
            update();
          }` : `update();`}
  });
}
`;
}

function getLinkHmrCode(esModule, loaderContext, request) {
  const modulePath = stringifyRequest(loaderContext, `!!${request}`);
  return `
if (module.hot) {
  module.hot.accept(
    ${modulePath},
    function() {
     ${esModule ? "update(content);" : `content = require(${modulePath});

           content = content.__esModule ? content.default : content;

           update(content);`}
    }
  );

  module.hot.dispose(function() {
    update();
  });
}`;
}

function getdomAPI(isAuto) {
  return isAuto ? "isOldIE() ? domAPISingleton : domAPI" : "domAPI";
}

function getImportIsOldIECode(esModule, loaderContext) {
  const modulePath = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/isOldIE.js")}`);
  return esModule ? `import isOldIE from ${modulePath};` : `var isOldIE = require(${modulePath});`;
}

function getStyleTagTransformFnCode(esModule, loaderContext, options, isSingleton, styleTagTransformType) {
  if (isSingleton) {
    return "";
  }

  if (styleTagTransformType === "default") {
    const modulePath = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/styleTagTransform.js")}`);
    return esModule ? `import styleTagTransformFn from ${modulePath};` : `var styleTagTransformFn = require(${modulePath});`;
  }

  if (styleTagTransformType === "module-path") {
    const modulePath = stringifyRequest(loaderContext, `${options.styleTagTransform}`);
    loaderContext.addBuildDependency(options.styleTagTransform);
    return esModule ? `import styleTagTransformFn from ${modulePath};` : `var styleTagTransformFn = require(${modulePath});`;
  }

  return "";
}

function getStyleTagTransformFn(options, isSingleton) {
  // Todo remove "function" type for styleTagTransform option in next major release, because code duplication occurs. Leave require.resolve()
  return isSingleton ? "" : typeof options.styleTagTransform === "function" ? `options.styleTagTransform = ${options.styleTagTransform.toString()}` : `options.styleTagTransform = styleTagTransformFn`;
}

function getExportStyleCode(esModule, loaderContext, request) {
  const modulePath = stringifyRequest(loaderContext, `!!${request}`);
  return esModule ? `export * from ${modulePath};
       export default content && content.locals ? content.locals : undefined;` : "module.exports = content && content.locals || {};";
}

function getExportLazyStyleCode(esModule, loaderContext, request) {
  const modulePath = stringifyRequest(loaderContext, `!!${request}`);
  return esModule ? `export * from ${modulePath};
       export default exported;` : "module.exports = exported;";
}

function getSetAttributesCode(esModule, loaderContext, options) {
  let modulePath;

  if (typeof options.attributes !== "undefined") {
    modulePath = options.attributes.nonce !== "undefined" ? stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/setAttributesWithAttributesAndNonce.js")}`) : stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/setAttributesWithAttributes.js")}`);
  } else {
    modulePath = stringifyRequest(loaderContext, `!${_path.default.join(__dirname, "runtime/setAttributesWithoutAttributes.js")}`);
  }

  return esModule ? `import setAttributes from ${modulePath};` : `var setAttributes = require(${modulePath});`;
} // eslint-disable-next-line import/prefer-default-export
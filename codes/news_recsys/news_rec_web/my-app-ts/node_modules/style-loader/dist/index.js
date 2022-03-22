"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _utils = require("./utils");

var _options = _interopRequireDefault(require("./options.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const loaderAPI = () => {};

loaderAPI.pitch = function loader(request) {
  const options = this.getOptions(_options.default);
  const injectType = options.injectType || "styleTag";
  const esModule = typeof options.esModule !== "undefined" ? options.esModule : true;
  const runtimeOptions = {};

  if (options.attributes) {
    runtimeOptions.attributes = options.attributes;
  }

  if (options.base) {
    runtimeOptions.base = options.base;
  }

  const insertType = typeof options.insert === "function" ? "function" : options.insert && _path.default.isAbsolute(options.insert) ? "module-path" : "selector";
  const styleTagTransformType = typeof options.styleTagTransform === "function" ? "function" : options.styleTagTransform && _path.default.isAbsolute(options.styleTagTransform) ? "module-path" : "default";

  switch (injectType) {
    case "linkTag":
      {
        const hmrCode = this.hot ? (0, _utils.getLinkHmrCode)(esModule, this, request) : "";
        return `
      ${(0, _utils.getImportLinkAPICode)(esModule, this)}
      ${(0, _utils.getImportInsertBySelectorCode)(esModule, this, insertType, options)}
      ${(0, _utils.getImportLinkContentCode)(esModule, this, request)}
      ${esModule ? "" : `content = content.__esModule ? content.default : content;`}

var options = ${JSON.stringify(runtimeOptions)};

${(0, _utils.getInsertOptionCode)(insertType, options)}

var update = API(content, options);

${hmrCode}

${esModule ? "export default {}" : ""}`;
      }

    case "lazyStyleTag":
    case "lazyAutoStyleTag":
    case "lazySingletonStyleTag":
      {
        const isSingleton = injectType === "lazySingletonStyleTag";
        const isAuto = injectType === "lazyAutoStyleTag";
        const hmrCode = this.hot ? (0, _utils.getStyleHmrCode)(esModule, this, request, true) : "";
        return `
      var exported = {};

      ${(0, _utils.getImportStyleAPICode)(esModule, this)}
      ${(0, _utils.getImportStyleDomAPICode)(esModule, this, isSingleton, isAuto)}
      ${(0, _utils.getImportInsertBySelectorCode)(esModule, this, insertType, options)}
      ${(0, _utils.getSetAttributesCode)(esModule, this, options)}
      ${(0, _utils.getImportInsertStyleElementCode)(esModule, this)}
      ${(0, _utils.getStyleTagTransformFnCode)(esModule, this, options, isSingleton, styleTagTransformType)}
      ${(0, _utils.getImportStyleContentCode)(esModule, this, request)}
      ${isAuto ? (0, _utils.getImportIsOldIECode)(esModule, this) : ""}
      ${esModule ? `if (content && content.locals) {
              exported.locals = content.locals;
            }
            ` : `content = content.__esModule ? content.default : content;

            exported.locals = content.locals || {};`}

var refs = 0;
var update;
var options = ${JSON.stringify(runtimeOptions)};

${(0, _utils.getStyleTagTransformFn)(options, isSingleton)};
options.setAttributes = setAttributes;
${(0, _utils.getInsertOptionCode)(insertType, options)}
options.domAPI = ${(0, _utils.getdomAPI)(isAuto)};
options.insertStyleElement = insertStyleElement;

exported.use = function(insertOptions) {
  options.options = insertOptions || {};

  if (!(refs++)) {
    update = API(content, options);
  }

  return exported;
};
exported.unuse = function() {
  if (refs > 0 && !--refs) {
    update();
    update = null;
  }
};

${hmrCode}

${(0, _utils.getExportLazyStyleCode)(esModule, this, request)}
`;
      }

    case "styleTag":
    case "autoStyleTag":
    case "singletonStyleTag":
    default:
      {
        const isSingleton = injectType === "singletonStyleTag";
        const isAuto = injectType === "autoStyleTag";
        const hmrCode = this.hot ? (0, _utils.getStyleHmrCode)(esModule, this, request, false) : "";
        return `
      ${(0, _utils.getImportStyleAPICode)(esModule, this)}
      ${(0, _utils.getImportStyleDomAPICode)(esModule, this, isSingleton, isAuto)}
      ${(0, _utils.getImportInsertBySelectorCode)(esModule, this, insertType, options)}
      ${(0, _utils.getSetAttributesCode)(esModule, this, options)}
      ${(0, _utils.getImportInsertStyleElementCode)(esModule, this)}
      ${(0, _utils.getStyleTagTransformFnCode)(esModule, this, options, isSingleton, styleTagTransformType)}
      ${(0, _utils.getImportStyleContentCode)(esModule, this, request)}
      ${isAuto ? (0, _utils.getImportIsOldIECode)(esModule, this) : ""}
      ${esModule ? "" : `content = content.__esModule ? content.default : content;`}

var options = ${JSON.stringify(runtimeOptions)};

${(0, _utils.getStyleTagTransformFn)(options, isSingleton)};
options.setAttributes = setAttributes;
${(0, _utils.getInsertOptionCode)(insertType, options)}
options.domAPI = ${(0, _utils.getdomAPI)(isAuto)};
options.insertStyleElement = insertStyleElement;

var update = API(content, options);

${hmrCode}

${(0, _utils.getExportStyleCode)(esModule, this, request)}
`;
      }
  }
};

var _default = loaderAPI;
exports.default = _default;
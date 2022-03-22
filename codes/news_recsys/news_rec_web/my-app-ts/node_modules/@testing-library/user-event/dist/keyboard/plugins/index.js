"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceBehavior = exports.preKeyupBehavior = exports.preKeydownBehavior = exports.postKeyupBehavior = exports.keyupBehavior = exports.keypressBehavior = exports.keydownBehavior = void 0;

var _utils = require("../../utils");

var arrowKeys = _interopRequireWildcard(require("./arrow"));

var controlKeys = _interopRequireWildcard(require("./control"));

var characterKeys = _interopRequireWildcard(require("./character"));

var functionalKeys = _interopRequireWildcard(require("./functional"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const replaceBehavior = [{
  matches: (keyDef, element) => keyDef.key === 'selectall' && (0, _utils.isElementType)(element, ['input', 'textarea']),
  handle: (keyDef, element, options, state) => {
    var _state$carryValue;

    (0, _utils.setSelectionRange)(element, 0, ((_state$carryValue = state.carryValue) != null ? _state$carryValue : element.value).length);
  }
}];
exports.replaceBehavior = replaceBehavior;
const preKeydownBehavior = [...functionalKeys.preKeydownBehavior];
exports.preKeydownBehavior = preKeydownBehavior;
const keydownBehavior = [...arrowKeys.keydownBehavior, ...controlKeys.keydownBehavior, ...functionalKeys.keydownBehavior];
exports.keydownBehavior = keydownBehavior;
const keypressBehavior = [...functionalKeys.keypressBehavior, ...characterKeys.keypressBehavior];
exports.keypressBehavior = keypressBehavior;
const preKeyupBehavior = [...functionalKeys.preKeyupBehavior];
exports.preKeyupBehavior = preKeyupBehavior;
const keyupBehavior = [...functionalKeys.keyupBehavior];
exports.keyupBehavior = keyupBehavior;
const postKeyupBehavior = [...functionalKeys.postKeyupBehavior];
exports.postKeyupBehavior = postKeyupBehavior;
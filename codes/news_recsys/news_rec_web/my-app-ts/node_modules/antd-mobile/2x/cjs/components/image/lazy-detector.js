"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyDetector = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ahooks = require("ahooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const LazyDetector = props => {
  const ref = (0, _react.useRef)(null);
  const [inViewport] = (0, _ahooks.useInViewport)(ref);
  (0, _react.useEffect)(() => {
    if (inViewport) {
      props.onActive();
    }
  }, [inViewport]);
  return _react.default.createElement("div", {
    ref: ref
  });
};

exports.LazyDetector = LazyDetector;
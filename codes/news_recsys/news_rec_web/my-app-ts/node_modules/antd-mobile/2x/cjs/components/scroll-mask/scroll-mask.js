"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollMask = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _web = require("@react-spring/web");

var _ahooks = require("ahooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-scroll-mask`;

const ScrollMask = props => {
  const maskRef = (0, _react.useRef)(null);
  const [{
    leftMaskOpacity,
    rightMaskOpacity
  }, api] = (0, _web.useSpring)(() => ({
    leftMaskOpacity: 0,
    rightMaskOpacity: 0,
    config: {
      clamp: true
    }
  }));
  const {
    run: updateMask
  } = (0, _ahooks.useThrottleFn)((immediate = false) => {
    const mask = maskRef.current;
    if (!mask) return;
    const scrollEl = props.scrollTrackRef.current;
    if (!scrollEl) return;
    const scrollLeft = scrollEl.scrollLeft;
    const showLeftMask = scrollLeft > 0;
    const showRightMask = scrollLeft + scrollEl.offsetWidth < scrollEl.scrollWidth;
    api.start({
      leftMaskOpacity: showLeftMask ? 1 : 0,
      rightMaskOpacity: showRightMask ? 1 : 0,
      immediate
    });
  }, {
    wait: 100,
    trailing: true,
    leading: true
  });
  (0, _react.useEffect)(() => {
    updateMask(true);
  }, []);
  (0, _react.useEffect)(() => {
    const scrollEl = props.scrollTrackRef.current;
    if (!scrollEl) return;
    scrollEl.addEventListener('scroll', updateMask);
    return () => scrollEl.removeEventListener('scroll', updateMask);
  }, []);
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_web.animated.div, {
    ref: maskRef,
    className: (0, _classnames.default)(classPrefix, `${classPrefix}-left`),
    style: {
      opacity: leftMaskOpacity
    }
  }), _react.default.createElement(_web.animated.div, {
    className: (0, _classnames.default)(classPrefix, `${classPrefix}-right`),
    style: {
      opacity: rightMaskOpacity
    }
  }));
};

exports.ScrollMask = ScrollMask;
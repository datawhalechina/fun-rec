"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderImperatively = renderImperatively;

var _react = _interopRequireWildcard(require("react"));

var _renderToBody = require("./render-to-body");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function renderImperatively(element) {
  const Wrapper = _react.default.forwardRef((_, ref) => {
    const [visible, setVisible] = (0, _react.useState)(false);
    const closedRef = (0, _react.useRef)(false);
    (0, _react.useEffect)(() => {
      if (!closedRef.current) {
        setVisible(true);
      } else {
        afterClose();
      }
    }, []);

    function onClose() {
      var _a, _b;

      closedRef.current = true;
      setVisible(false);
      (_b = (_a = element.props).onClose) === null || _b === void 0 ? void 0 : _b.call(_a);
    }

    function afterClose() {
      var _a, _b;

      unmount();
      (_b = (_a = element.props).afterClose) === null || _b === void 0 ? void 0 : _b.call(_a);
    }

    (0, _react.useImperativeHandle)(ref, () => ({
      close: onClose
    }));
    return _react.default.cloneElement(element, Object.assign(Object.assign({}, element.props), {
      visible,
      onClose,
      afterClose
    }));
  });

  const wrapperRef = _react.default.createRef();

  const unmount = (0, _renderToBody.renderToBody)(_react.default.createElement(Wrapper, {
    ref: wrapperRef
  }));

  function close() {
    var _a;

    (_a = wrapperRef.current) === null || _a === void 0 ? void 0 : _a.close();
  }

  return {
    close
  };
}
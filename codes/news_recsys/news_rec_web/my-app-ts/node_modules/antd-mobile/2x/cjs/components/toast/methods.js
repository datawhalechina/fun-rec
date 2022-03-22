"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;
exports.config = config;
exports.show = show;

var _react = _interopRequireWildcard(require("react"));

var _getContainer = require("../../utils/get-container");

var _reactDom = _interopRequireDefault(require("react-dom"));

var _toast = require("./toast");

var _withDefaultProps = require("../../utils/with-default-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const containers = [];

function unmount(container) {
  const unmountResult = _reactDom.default.unmountComponentAtNode(container);

  if (unmountResult && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

const defaultProps = {
  duration: 2000,
  position: 'center',
  maskClickable: true
};

function show(p) {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, typeof p === 'string' ? {
    content: p
  } : p);
  let timer = 0;
  const {
    getContainer = () => document.body
  } = props;
  const container = document.createElement('div');
  const bodyContainer = (0, _getContainer.resolveContainer)(getContainer);
  bodyContainer.appendChild(container);
  clear();
  containers.push(container);
  const TempToast = (0, _react.forwardRef)((_, ref) => {
    const [visible, setVisible] = (0, _react.useState)(true);
    (0, _react.useEffect)(() => {
      return () => {
        var _a;

        (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
      };
    }, []);
    (0, _react.useEffect)(() => {
      if (props.duration === 0) {
        return;
      }

      timer = window.setTimeout(() => {
        setVisible(false);
      }, props.duration);
      return () => {
        window.clearTimeout(timer);
      };
    }, []);
    (0, _react.useImperativeHandle)(ref, () => ({
      close: () => setVisible(false)
    }));
    return _react.default.createElement(_toast.InternalToast, Object.assign({}, props, {
      getContainer: () => container,
      visible: visible,
      afterClose: () => {
        unmount(container);
      }
    }));
  });
  const ref = (0, _react.createRef)();

  _reactDom.default.render(_react.default.createElement(TempToast, {
    ref: ref
  }), container);

  return {
    close: () => {
      var _a;

      (_a = ref.current) === null || _a === void 0 ? void 0 : _a.close();
    }
  };
}

function clear() {
  while (true) {
    const container = containers.pop();
    if (!container) break;
    unmount(container);
  }
}

function config(val) {
  if (val.duration !== undefined) {
    defaultProps.duration = val.duration;
  }

  if (val.position !== undefined) {
    defaultProps.position = val.position;
  }

  if (val.maskClickable !== undefined) {
    defaultProps.maskClickable = val.maskClickable;
  }
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prompt = prompt;

var _react = _interopRequireWildcard(require("react"));

var _renderToBody = require("../../utils/render-to-body");

var _datePicker = require("./date-picker");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function prompt(props) {
  return new Promise(resolve => {
    const Wrapper = () => {
      const [visible, setVisible] = (0, _react.useState)(false);
      (0, _react.useEffect)(() => {
        setVisible(true);
      }, []);
      return _react.default.createElement(_datePicker.DatePicker, Object.assign({}, props, {
        visible: visible,
        onConfirm: val => {
          var _a;

          (_a = props.onConfirm) === null || _a === void 0 ? void 0 : _a.call(props, val);
          resolve(val);
        },
        onClose: () => {
          var _a;

          (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
          setVisible(false);
          resolve(null);
        },
        afterClose: () => {
          var _a;

          (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
          unmount();
        }
      }));
    };

    const unmount = (0, _renderToBody.renderToBody)(_react.default.createElement(Wrapper, null));
  });
}
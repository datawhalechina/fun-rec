"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormImperativeItem = void 0;

var _tslib = require("tslib");

var _react = _interopRequireWildcard(require("react"));

var _formItem = require("./form-item");

var _datePicker = _interopRequireDefault(require("../date-picker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Inner = (0, _react.forwardRef)((props, ref) => {
  (0, _react.useImperativeHandle)(ref, () => ({
    trigger: () => (0, _tslib.__awaiter)(void 0, void 0, void 0, function* () {
      var _a;

      const v = yield _datePicker.default.prompt({
        defaultValue: props.value
      });

      if (v !== null) {
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, v);
      }
    })
  }));
  return _react.default.createElement(_react.default.Fragment, null, props.renderValue(props.value));
});

const FormImperativeItem = props => {
  const {
    renderValue
  } = props,
        formItemProps = (0, _tslib.__rest)(props, ["renderValue"]);
  const ref = (0, _react.useRef)(null);
  return _react.default.createElement(_formItem.FormItem, Object.assign({}, formItemProps, {
    onClick: () => {
      var _a;

      (_a = ref.current) === null || _a === void 0 ? void 0 : _a.trigger();
    }
  }), _react.default.createElement(Inner, {
    ref: ref,
    renderValue: renderValue
  }));
};

exports.FormImperativeItem = FormImperativeItem;
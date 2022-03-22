"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rate = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

var _antdMobileIcons = require("antd-mobile-icons");

var _usePropsValue = require("../../utils/use-props-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-rate`;
const defaultProps = {
  count: 5,
  allowHalf: false,
  character: _react.default.createElement(_antdMobileIcons.StarFill, null),
  defaultValue: 0,
  readOnly: false,
  allowClear: true
};

const Rate = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)(props);
  const starList = Array(props.count).fill(null);

  function renderStar(v, half) {
    return _react.default.createElement("div", {
      className: (0, _classnames.default)(`${classPrefix}-star`, {
        [`${classPrefix}-star-active`]: value >= v,
        [`${classPrefix}-star-half`]: half,
        [`${classPrefix}-star-readonly`]: props.readOnly
      }),
      onClick: () => {
        if (props.readOnly) return;

        if (props.allowClear && value === v) {
          setValue(0);
        } else {
          setValue(v);
        }
      }
    }, props.character);
  }

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, starList.map((_, i) => _react.default.createElement("div", {
    key: i,
    className: (0, _classnames.default)(`${classPrefix}-box`)
  }, props.allowHalf && renderStar(i + 0.5, true), renderStar(i + 1, false)))));
};

exports.Rate = Rate;
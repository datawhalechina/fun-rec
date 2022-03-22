"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Steps = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _withDefaultProps = require("../../utils/with-default-props");

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-steps`;
const stepClassPrefix = `adm-step`;

const defaultIcon = _react.default.createElement("span", {
  className: `${stepClassPrefix}-icon-dot`
});

const defaultProps = {
  current: 0,
  direction: 'horizontal'
};

const Steps = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const {
    direction,
    current
  } = props;
  const classString = (0, _classnames.default)(classPrefix, `${classPrefix}-${direction}`);
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classString
  }, _react.default.Children.map(props.children, (child, index) => {
    var _a;

    if (!_react.default.isValidElement(child)) {
      return child;
    }

    const props = child.props;
    let status = props.status || 'wait';

    if (index < current) {
      status = props.status || 'finish';
    } else if (index === current) {
      status = props.status || 'process';
    }

    const icon = (_a = props.icon) !== null && _a !== void 0 ? _a : defaultIcon;
    return _react.default.cloneElement(child, {
      status,
      icon
    });
  })));
};

exports.Steps = Steps;
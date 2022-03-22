"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckList = void 0;

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _list = _interopRequireDefault(require("../list"));

var _withDefaultProps = require("../../utils/with-default-props");

var _context = require("./context");

var _usePropsValue = require("../../utils/use-props-value");

var _antdMobileIcons = require("antd-mobile-icons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = 'adm-check-list';
const defaultProps = {
  multiple: false,
  defaultValue: [],
  activeIcon: _react.default.createElement(_antdMobileIcons.CheckOutline, null)
};

const CheckList = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)(props);

  function check(val) {
    if (props.multiple) {
      setValue([...value, val]);
    } else {
      setValue([val]);
    }
  }

  function uncheck(val) {
    setValue(value.filter(item => item !== val));
  }

  const {
    activeIcon,
    disabled,
    readOnly
  } = props;
  return _react.default.createElement(_context.CheckListContext.Provider, {
    value: {
      value,
      check,
      uncheck,
      activeIcon,
      disabled,
      readOnly
    }
  }, (0, _nativeProps.withNativeProps)(props, _react.default.createElement(_list.default, {
    mode: props.mode,
    className: classPrefix
  }, props.children)));
};

exports.CheckList = CheckList;
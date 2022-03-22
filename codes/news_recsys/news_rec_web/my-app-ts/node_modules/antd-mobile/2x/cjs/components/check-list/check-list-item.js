"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckListItem = void 0;

var _react = _interopRequireWildcard(require("react"));

var _list = _interopRequireDefault(require("../list"));

var _nativeProps = require("../../utils/native-props");

var _context = require("./context");

var _devLog = require("../../utils/dev-log");

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-check-list-item`;

const CheckListItem = props => {
  const context = (0, _react.useContext)(_context.CheckListContext);

  if (context === null) {
    (0, _devLog.devWarning)('CheckList.Item', 'CheckList.Item can only be used inside CheckList.');
    return null;
  }

  const active = context.value.includes(props.value);
  const readOnly = props.readOnly || context.readOnly;

  const extra = _react.default.createElement("div", {
    className: `${classPrefix}-extra`
  }, active ? context.activeIcon : null);

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement(_list.default.Item, {
    title: props.title,
    className: (0, _classnames.default)(classPrefix, readOnly && `${classPrefix}-readonly`, active && `${classPrefix}-active`),
    description: props.description,
    prefix: props.prefix,
    onClick: e => {
      var _a;

      if (readOnly) return;

      if (active) {
        context.uncheck(props.value);
      } else {
        context.check(props.value);
      }

      (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, e);
    },
    arrow: false,
    clickable: !readOnly,
    extra: extra,
    disabled: props.disabled || context.disabled
  }, props.children));
};

exports.CheckListItem = CheckListItem;
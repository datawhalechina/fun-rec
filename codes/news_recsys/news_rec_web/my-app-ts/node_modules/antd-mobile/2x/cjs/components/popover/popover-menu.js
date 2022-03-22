"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopoverMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _popover = require("./popover");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-popover-menu`;
const PopoverMenu = (0, _react.forwardRef)((props, ref) => {
  const innerRef = (0, _react.useRef)(null);
  (0, _react.useImperativeHandle)(ref, () => innerRef.current, []);
  const onClick = (0, _react.useCallback)(e => {
    var _a;

    const {
      onAction
    } = props;

    if (onAction) {
      onAction(e);
    }

    (_a = innerRef.current) === null || _a === void 0 ? void 0 : _a.hide();
  }, [props.onAction]);
  const overlay = (0, _react.useMemo)(() => {
    return _react.default.createElement("div", {
      className: `${classPrefix}-list`
    }, _react.default.createElement("div", {
      className: `${classPrefix}-list-inner`
    }, props.actions.map((action, index) => {
      var _a;

      return _react.default.createElement("a", {
        key: (_a = action.key) !== null && _a !== void 0 ? _a : index,
        className: (0, _classnames.default)(`${classPrefix}-item`, 'adm-plain-anchor', action.disabled && `${classPrefix}-item-disabled`),
        onClick: () => {
          var _a;

          if (action.disabled) return;
          onClick(action);
          (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action);
        }
      }, action.icon && _react.default.createElement("div", {
        className: `${classPrefix}-item-icon`
      }, action.icon), _react.default.createElement("div", {
        className: `${classPrefix}-item-text`
      }, action.text));
    })));
  }, [props.actions, onClick]);
  return _react.default.createElement(_popover.Popover, Object.assign({
    ref: innerRef
  }, props, {
    className: (0, _classnames.default)(classPrefix, props.className),
    content: overlay
  }), props.children);
});
exports.PopoverMenu = PopoverMenu;
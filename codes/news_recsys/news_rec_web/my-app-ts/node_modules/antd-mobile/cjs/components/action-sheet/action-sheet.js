"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionSheet = void 0;
exports.showActionSheet = showActionSheet;

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

var _classnames = _interopRequireDefault(require("classnames"));

var _popup = _interopRequireDefault(require("../popup"));

var _button = _interopRequireDefault(require("../button"));

var _safeArea = _interopRequireDefault(require("../safe-area"));

var _renderImperatively = require("../../utils/render-imperatively");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-action-sheet`;
const defaultProps = {
  visible: false,
  actions: [],
  cancelText: '',
  closeOnAction: false,
  closeOnMaskClick: true,
  safeArea: true
};

const ActionSheet = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  return _react.default.createElement(_popup.default, {
    visible: props.visible,
    onMaskClick: () => {
      var _a, _b;

      (_a = props.onMaskClick) === null || _a === void 0 ? void 0 : _a.call(props);

      if (props.closeOnMaskClick) {
        (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
      }
    },
    afterClose: props.afterClose,
    className: (0, _classnames.default)(`${classPrefix}-popup`, props.popupClassName),
    style: props.popupStyle,
    getContainer: props.getContainer
  }, (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, props.extra && _react.default.createElement("div", {
    className: `${classPrefix}-extra`
  }, props.extra), _react.default.createElement("div", {
    className: `${classPrefix}-button-list`
  }, props.actions.map((action, index) => _react.default.createElement("div", {
    key: action.key,
    className: `${classPrefix}-button-item-wrapper`
  }, _react.default.createElement(_button.default, {
    block: true,
    fill: 'none',
    shape: 'rectangular',
    disabled: action.disabled,
    onClick: () => {
      var _a, _b, _c;

      (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action);
      (_b = props.onAction) === null || _b === void 0 ? void 0 : _b.call(props, action, index);

      if (props.closeOnAction) {
        (_c = props.onClose) === null || _c === void 0 ? void 0 : _c.call(props);
      }
    },
    className: (0, _classnames.default)(`${classPrefix}-button-item`, {
      [`${classPrefix}-button-item-danger`]: action.danger
    })
  }, _react.default.createElement("div", {
    className: `${classPrefix}-button-item-name`
  }, action.text), action.description && _react.default.createElement("div", {
    className: `${classPrefix}-button-item-description`
  }, action.description))))), props.cancelText && _react.default.createElement("div", {
    className: `${classPrefix}-cancel`
  }, _react.default.createElement("div", {
    className: `${classPrefix}-button-item-wrapper`
  }, _react.default.createElement(_button.default, {
    block: true,
    fill: 'none',
    shape: 'rectangular',
    className: `${classPrefix}-button-item`,
    onClick: () => {
      var _a;

      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  }, _react.default.createElement("div", {
    className: `${classPrefix}-button-item-name`
  }, props.cancelText)))), props.safeArea && _react.default.createElement(_safeArea.default, {
    position: 'bottom'
  }))));
};

exports.ActionSheet = ActionSheet;

function showActionSheet(props) {
  return (0, _renderImperatively.renderImperatively)(_react.default.createElement(ActionSheet, Object.assign({}, props)));
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alert = alert;

var _show = require("./show");

var _withDefaultProps = require("../../utils/with-default-props");

var _configProvider = require("../config-provider");

function alert(p) {
  const defaultProps = {
    confirmText: (0, _configProvider.getDefaultConfig)().locale.Modal.ok
  };
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  return new Promise(resolve => {
    (0, _show.show)(Object.assign(Object.assign({}, props), {
      closeOnAction: true,
      actions: [{
        key: 'confirm',
        text: props.confirmText,
        primary: true
      }],
      onAction: props.onConfirm,
      onClose: () => {
        var _a;

        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
        resolve();
      }
    }));
  });
}
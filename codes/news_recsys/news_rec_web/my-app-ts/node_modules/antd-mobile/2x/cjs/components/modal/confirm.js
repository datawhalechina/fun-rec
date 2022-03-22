"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirm = confirm;

var _tslib = require("tslib");

var _show = require("./show");

var _withDefaultProps = require("../../utils/with-default-props");

var _configProvider = require("../config-provider");

const defaultProps = {
  confirmText: '确认',
  cancelText: '取消'
};

function confirm(p) {
  const {
    locale
  } = (0, _configProvider.getDefaultConfig)();
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, {
    confirmText: locale.common.confirm,
    cancelText: locale.common.cancel
  }, p);
  return new Promise(resolve => {
    (0, _show.show)(Object.assign(Object.assign({}, props), {
      closeOnAction: true,
      onClose: () => {
        var _a;

        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
        resolve(false);
      },
      actions: [{
        key: 'confirm',
        text: props.confirmText,
        primary: true,
        onClick: () => (0, _tslib.__awaiter)(this, void 0, void 0, function* () {
          var _a;

          yield (_a = props.onConfirm) === null || _a === void 0 ? void 0 : _a.call(props);
          resolve(true);
        })
      }, {
        key: 'cancel',
        text: props.cancelText,
        onClick: () => (0, _tslib.__awaiter)(this, void 0, void 0, function* () {
          var _b;

          yield (_b = props.onCancel) === null || _b === void 0 ? void 0 : _b.call(props);
          resolve(false);
        })
      }]
    }));
  });
}
import { __awaiter } from "tslib";
import { show } from './show';
import { mergeProps } from '../../utils/with-default-props';
import { getDefaultConfig } from '../config-provider';
const defaultProps = {
  confirmText: '确认',
  cancelText: '取消'
};
export function confirm(p) {
  const {
    locale
  } = getDefaultConfig();
  const props = mergeProps(defaultProps, {
    confirmText: locale.common.confirm,
    cancelText: locale.common.cancel
  }, p);
  return new Promise(resolve => {
    show(Object.assign(Object.assign({}, props), {
      closeOnAction: true,
      onClose: () => {
        var _a;

        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
        resolve(false);
      },
      actions: [[{
        key: 'cancel',
        text: props.cancelText,
        onClick: () => __awaiter(this, void 0, void 0, function* () {
          var _a;

          yield (_a = props.onCancel) === null || _a === void 0 ? void 0 : _a.call(props);
          resolve(false);
        })
      }, {
        key: 'confirm',
        text: props.confirmText,
        bold: true,
        onClick: () => __awaiter(this, void 0, void 0, function* () {
          var _b;

          yield (_b = props.onConfirm) === null || _b === void 0 ? void 0 : _b.call(props);
          resolve(true);
        })
      }]]
    }));
  });
}
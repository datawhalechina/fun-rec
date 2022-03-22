import { show } from './show';
import { mergeProps } from '../../utils/with-default-props';
import { getDefaultConfig } from '../config-provider';
export function alert(p) {
  const defaultProps = {
    confirmText: getDefaultConfig().locale.Dialog.ok
  };
  const props = mergeProps(defaultProps, p);
  return new Promise(resolve => {
    show(Object.assign(Object.assign({}, props), {
      closeOnAction: true,
      actions: [{
        key: 'confirm',
        text: props.confirmText
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
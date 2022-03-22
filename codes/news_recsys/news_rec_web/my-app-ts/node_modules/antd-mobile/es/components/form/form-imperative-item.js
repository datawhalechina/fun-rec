import { __awaiter, __rest } from "tslib";
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FormItem } from './form-item';
import DatePicker from '../date-picker';
const Inner = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    trigger: () => __awaiter(void 0, void 0, void 0, function* () {
      var _a;

      const v = yield DatePicker.prompt({
        defaultValue: props.value
      });

      if (v !== null) {
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, v);
      }
    })
  }));
  return React.createElement(React.Fragment, null, props.renderValue(props.value));
});
export const FormImperativeItem = props => {
  const {
    renderValue
  } = props,
        formItemProps = __rest(props, ["renderValue"]);

  const ref = useRef(null);
  return React.createElement(FormItem, Object.assign({}, formItemProps, {
    onClick: () => {
      var _a;

      (_a = ref.current) === null || _a === void 0 ? void 0 : _a.trigger();
    }
  }), React.createElement(Inner, {
    ref: ref,
    renderValue: renderValue
  }));
};
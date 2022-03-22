import React from 'react';
import { mergeProps } from '../../utils/with-default-props';
import { RadioGroupContext } from './group-context';
import { usePropsValue } from '../../utils/use-props-value';
const defaultProps = {
  disabled: false,
  defaultValue: null
};
export const Group = p => {
  const props = mergeProps(defaultProps, p);
  const [value, setValue] = usePropsValue({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: v => {
      var _a;

      if (v === null) return;
      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, v);
    }
  });
  return React.createElement(RadioGroupContext.Provider // TODO: 性能优化
  , {
    // TODO: 性能优化
    value: {
      value: value === null ? [] : [value],
      check: v => {
        setValue(v);
      },
      uncheck: () => {},
      disabled: props.disabled
    }
  }, props.children);
};
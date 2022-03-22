import React from 'react';
import { mergeProps } from '../../utils/with-default-props';
import { CheckboxGroupContext } from './group-context';
import { usePropsValue } from '../../utils/use-props-value';
const defaultProps = {
  disabled: false,
  defaultValue: []
};
export const Group = p => {
  const props = mergeProps(defaultProps, p);
  const [value, setValue] = usePropsValue(props);
  return React.createElement(CheckboxGroupContext.Provider // TODO: 性能优化
  , {
    // TODO: 性能优化
    value: {
      value: value,
      disabled: props.disabled,
      check: v => {
        setValue([...value, v]);
      },
      uncheck: v => {
        setValue(value.filter(item => item !== v));
      }
    }
  }, props.children);
};
import React from 'react';
import { withNativeProps } from '../../utils/native-props';
import List from '../list';
import { mergeProps } from '../../utils/with-default-props';
import { CheckListContext } from './context';
import { usePropsValue } from '../../utils/use-props-value';
import { CheckOutline } from 'antd-mobile-icons';
const classPrefix = 'adm-check-list';
const defaultProps = {
  multiple: false,
  defaultValue: [],
  activeIcon: React.createElement(CheckOutline, null)
};
export const CheckList = p => {
  const props = mergeProps(defaultProps, p);
  const [value, setValue] = usePropsValue(props);

  function check(val) {
    if (props.multiple) {
      setValue([...value, val]);
    } else {
      setValue([val]);
    }
  }

  function uncheck(val) {
    setValue(value.filter(item => item !== val));
  }

  const {
    activeIcon,
    disabled,
    readOnly
  } = props;
  return React.createElement(CheckListContext.Provider, {
    value: {
      value,
      check,
      uncheck,
      activeIcon,
      disabled,
      readOnly
    }
  }, withNativeProps(props, React.createElement(List, {
    mode: props.mode,
    className: classPrefix
  }, props.children)));
};
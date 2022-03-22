import React from 'react';
import classNames from 'classnames';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
import { StarFill } from 'antd-mobile-icons';
import { usePropsValue } from '../../utils/use-props-value';
const classPrefix = `adm-rate`;
const defaultProps = {
  count: 5,
  allowHalf: false,
  character: React.createElement(StarFill, null),
  defaultValue: 0,
  readOnly: false,
  allowClear: true
};
export const Rate = p => {
  const props = mergeProps(defaultProps, p);
  const [value, setValue] = usePropsValue(props);
  const starList = Array(props.count).fill(null);

  function renderStar(v, half) {
    return React.createElement("div", {
      className: classNames(`${classPrefix}-star`, {
        [`${classPrefix}-star-active`]: value >= v,
        [`${classPrefix}-star-half`]: half,
        [`${classPrefix}-star-readonly`]: props.readOnly
      }),
      onClick: () => {
        if (props.readOnly) return;

        if (props.allowClear && value === v) {
          setValue(0);
        } else {
          setValue(v);
        }
      }
    }, props.character);
  }

  return withNativeProps(props, React.createElement("div", {
    className: classPrefix
  }, starList.map((_, i) => React.createElement("div", {
    key: i,
    className: classNames(`${classPrefix}-box`)
  }, props.allowHalf && renderStar(i + 0.5, true), renderStar(i + 1, false)))));
};
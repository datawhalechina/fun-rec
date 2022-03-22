import React, { memo } from 'react';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = `adm-page-indicator`;
const defaultProps = {
  color: 'primary',
  direction: 'horizontal'
};
export const PageIndicator = memo(p => {
  const props = mergeProps(defaultProps, p);
  const dots = [];

  for (let i = 0; i < props.total; i++) {
    dots.push(React.createElement("div", {
      key: i,
      className: classNames(`${classPrefix}-dot`, {
        [`${classPrefix}-dot-active`]: props.current === i
      })
    }));
  }

  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, `${classPrefix}-${props.direction}`, `${classPrefix}-color-${props.color}`)
  }, dots));
});
import { __awaiter } from "tslib";
import classNames from 'classnames';
import React, { useState } from 'react';
import { withNativeProps } from '../../utils/native-props';
import { usePropsValue } from '../../utils/use-props-value';
import { mergeProps } from '../../utils/with-default-props';
import { SpinIcon } from './spin-icon';
const classPrefix = `adm-switch`;
const defaultProps = {
  defaultChecked: false
};
export const Switch = p => {
  const props = mergeProps(defaultProps, p);
  const disabled = props.disabled || props.loading || false;
  const [changing, setChanging] = useState(false);
  const [checked, setChecked] = usePropsValue({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange
  });

  function onClick() {
    return __awaiter(this, void 0, void 0, function* () {
      if (disabled || props.loading || changing) {
        return;
      }

      const nextChecked = !checked;

      if (props.beforeChange) {
        setChanging(true);

        try {
          yield props.beforeChange(nextChecked);
          setChecked(nextChecked);
          setChanging(false);
        } catch (e) {
          setChanging(false);
          throw e;
        }
      } else {
        setChecked(nextChecked);
      }
    });
  }

  return withNativeProps(props, React.createElement("div", {
    onClick: onClick,
    className: classNames(classPrefix, {
      [`${classPrefix}-checked`]: checked,
      [`${classPrefix}-disabled`]: disabled || changing
    })
  }, React.createElement("div", {
    className: `${classPrefix}-checkbox`
  }, React.createElement("div", {
    className: `${classPrefix}-handle`
  }, (props.loading || changing) && React.createElement(SpinIcon, {
    className: `${classPrefix}-spin-icon`
  })), React.createElement("div", {
    className: `${classPrefix}-inner`
  }, checked ? props.checkedText : props.uncheckedText))));
};
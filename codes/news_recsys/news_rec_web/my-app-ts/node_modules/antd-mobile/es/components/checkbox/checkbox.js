import React, { useContext } from 'react';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
import { CheckboxGroupContext } from './group-context';
import { usePropsValue } from '../../utils/use-props-value';
import { mergeProps } from '../../utils/with-default-props';
import { devWarning } from '../../utils/dev-log';
import { CheckIcon } from './check-icon';
import { IndeterminateIcon } from './indeterminate-icon';
import { isDev } from '../../utils/is-dev';
import { NativeInput } from './native-input';
const classPrefix = `adm-checkbox`;
const defaultProps = {
  defaultChecked: false,
  indeterminate: false
};
export const Checkbox = p => {
  const groupContext = useContext(CheckboxGroupContext);
  const props = mergeProps(defaultProps, p);
  let [checked, setChecked] = usePropsValue({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange
  });
  let disabled = props.disabled;
  const {
    value
  } = props;

  if (groupContext && value !== undefined) {
    if (isDev) {
      if (p.checked !== undefined) {
        devWarning('Checkbox', 'When used within `Checkbox.Group`, the `checked` prop of `Checkbox` will not work.');
      }

      if (p.defaultChecked !== undefined) {
        devWarning('Checkbox', 'When used within `Checkbox.Group`, the `defaultChecked` prop of `Checkbox` will not work.');
      }
    }

    checked = groupContext.value.includes(value);

    setChecked = checked => {
      var _a;

      if (checked) {
        groupContext.check(value);
      } else {
        groupContext.uncheck(value);
      }

      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, checked);
    };

    disabled = disabled || groupContext.disabled;
  }

  const renderIcon = () => {
    if (props.icon) {
      return React.createElement("div", {
        className: `${classPrefix}-custom-icon`
      }, props.icon(checked, props.indeterminate));
    }

    return React.createElement("div", {
      className: `${classPrefix}-icon`
    }, props.indeterminate ? React.createElement(IndeterminateIcon, null) : checked && React.createElement(CheckIcon, null));
  };

  return withNativeProps(props, React.createElement("label", {
    className: classNames(classPrefix, {
      [`${classPrefix}-checked`]: checked && !props.indeterminate,
      [`${classPrefix}-indeterminate`]: props.indeterminate,
      [`${classPrefix}-disabled`]: disabled,
      [`${classPrefix}-block`]: props.block
    })
  }, React.createElement(NativeInput, {
    type: 'checkbox',
    checked: checked,
    onChange: setChecked,
    disabled: disabled,
    id: props.id
  }), renderIcon(), props.children && React.createElement("div", {
    className: `${classPrefix}-content`
  }, props.children)));
};
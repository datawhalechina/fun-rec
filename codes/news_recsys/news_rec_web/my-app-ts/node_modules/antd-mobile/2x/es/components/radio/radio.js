import React, { useContext } from 'react';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
import { RadioGroupContext } from './group-context';
import { usePropsValue } from '../../utils/use-props-value';
import { mergeProps } from '../../utils/with-default-props';
import { CheckIcon } from '../checkbox/check-icon';
import { devWarning } from '../../utils/dev-log';
import { isDev } from '../../utils/is-dev';
import { NativeInput } from '../checkbox/native-input';
const classPrefix = `adm-radio`;
const defaultProps = {
  defaultChecked: false
};
export const Radio = p => {
  const props = mergeProps(defaultProps, p);
  const groupContext = useContext(RadioGroupContext);
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
        devWarning('Radio', 'When used within `Radio.Group`, the `checked` prop of `Radio` will not work.');
      }

      if (p.defaultChecked !== undefined) {
        devWarning('Radio', 'When used within `Radio.Group`, the `defaultChecked` prop of `Radio` will not work.');
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
      }, props.icon(checked));
    }

    return React.createElement("div", {
      className: `${classPrefix}-icon`
    }, checked && React.createElement(CheckIcon, null));
  };

  return withNativeProps(props, React.createElement("label", {
    className: classNames(classPrefix, {
      [`${classPrefix}-checked`]: checked,
      [`${classPrefix}-disabled`]: disabled,
      [`${classPrefix}-block`]: props.block
    })
  }, React.createElement(NativeInput, {
    type: 'radio',
    checked: checked,
    onChange: setChecked,
    disabled: disabled,
    id: props.id
  }), renderIcon(), props.children && React.createElement("div", {
    className: `${classPrefix}-content`
  }, props.children)));
};
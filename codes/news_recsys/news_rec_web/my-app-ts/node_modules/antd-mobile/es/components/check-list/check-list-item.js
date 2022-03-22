import React, { useContext } from 'react';
import List from '../list';
import { withNativeProps } from '../../utils/native-props';
import { CheckListContext } from './context';
import { devWarning } from '../../utils/dev-log';
import classNames from 'classnames';
const classPrefix = `adm-check-list-item`;
export const CheckListItem = props => {
  const context = useContext(CheckListContext);

  if (context === null) {
    devWarning('CheckList.Item', 'CheckList.Item can only be used inside CheckList.');
    return null;
  }

  const active = context.value.includes(props.value);
  const readOnly = props.readOnly || context.readOnly;
  const extra = React.createElement("div", {
    className: `${classPrefix}-extra`
  }, active ? context.activeIcon : null);
  return withNativeProps(props, React.createElement(List.Item, {
    title: props.title,
    className: classNames(classPrefix, readOnly && `${classPrefix}-readonly`, active && `${classPrefix}-active`),
    description: props.description,
    prefix: props.prefix,
    onClick: e => {
      var _a;

      if (readOnly) return;

      if (active) {
        context.uncheck(props.value);
      } else {
        context.check(props.value);
      }

      (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, e);
    },
    arrow: false,
    clickable: !readOnly,
    extra: extra,
    disabled: props.disabled || context.disabled
  }, props.children));
};
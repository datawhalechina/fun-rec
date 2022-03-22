import classNames from 'classnames';
import React from 'react';
import { withNativeProps } from '../../utils/native-props';
import { useShouldRender } from '../../utils/should-render';
import { DownFill } from 'antd-mobile-icons';
const classPrefix = `adm-dropdown-item`;

const Item = props => {
  var _a;

  const cls = classNames(classPrefix, {
    [`${classPrefix}-active`]: props.active,
    [`${classPrefix}-highlight`]: (_a = props.highlight) !== null && _a !== void 0 ? _a : props.active
  });
  return withNativeProps(props, React.createElement("div", {
    className: cls,
    onClick: props.onClick
  }, React.createElement("div", {
    className: `${classPrefix}-title`
  }, React.createElement("span", {
    className: `${classPrefix}-title-text`
  }, props.title), React.createElement("span", {
    className: classNames(`${classPrefix}-title-arrow`, {
      [`${classPrefix}-title-arrow-active`]: props.active
    })
  }, props.arrow === undefined ? React.createElement(DownFill, null) : props.arrow))));
};

export default Item;
export const ItemChildrenWrap = props => {
  const {
    active = false
  } = props;
  const shouldRender = useShouldRender(active, props.forceRender, props.destroyOnClose);
  const cls = classNames(`${classPrefix}-content`, {
    [`${classPrefix}-content-hidden`]: !active
  });
  return shouldRender ? React.createElement("div", {
    className: cls,
    onClick: props.onClick
  }, props.children) : null;
};
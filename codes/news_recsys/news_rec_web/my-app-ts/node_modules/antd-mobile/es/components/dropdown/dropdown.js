import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import React, { cloneElement, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Popup from '../popup';
import { ItemChildrenWrap } from './item';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
import { usePropsValue } from '../../utils/use-props-value';
const classPrefix = `adm-dropdown`;
const defaultProps = {
  defaultActiveKey: null,
  closeOnMaskClick: true,
  closeOnClickAway: false
};
const Dropdown = forwardRef((p, ref) => {
  const props = mergeProps(defaultProps, p);
  const [value, setValue] = usePropsValue({
    value: props.activeKey,
    defaultValue: props.defaultActiveKey,
    onChange: props.onChange
  });
  const navRef = useRef(null);
  const contentRef = useRef(null); // 点击外部区域，关闭

  useClickAway(() => {
    if (!props.closeOnClickAway) return;
    setValue(null);
  }, [navRef, contentRef]); // 计算 navs 的 top 值

  const [top, setTop] = useState();
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (value) {
      const rect = container.getBoundingClientRect();
      setTop(rect.bottom);
    }
  }, [value]);

  const changeActive = key => {
    if (value === key) {
      setValue(null);
    } else {
      setValue(key);
    }
  };

  let popupForceRender = false;
  const items = [];
  const navs = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      const childProps = Object.assign(Object.assign({}, child.props), {
        onClick: () => {
          changeActive(child.key);
        },
        active: child.key === value,
        arrow: child.props.arrow === undefined ? props.arrow : child.props.arrow
      });
      items.push(child);
      if (child.props.forceRender) popupForceRender = true;
      return cloneElement(child, childProps);
    } else {
      return child;
    }
  });
  useImperativeHandle(ref, () => ({
    close: () => {
      setValue(null);
    }
  }), [setValue]);
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, {
      [`${classPrefix}-open`]: !!value
    }),
    ref: containerRef
  }, React.createElement("div", {
    className: `${classPrefix}-nav`,
    ref: navRef
  }, navs), React.createElement(Popup, {
    visible: !!value,
    position: 'top',
    className: `${classPrefix}-popup`,
    maskClassName: `${classPrefix}-popup-mask`,
    bodyClassName: `${classPrefix}-popup-body`,
    style: {
      top
    },
    forceRender: popupForceRender,
    onMaskClick: props.closeOnMaskClick ? () => {
      changeActive(null);
    } : undefined
  }, React.createElement("div", {
    ref: contentRef
  }, items.map(item => {
    const isActive = item.key === value;
    return React.createElement(ItemChildrenWrap, {
      key: item.key,
      active: isActive,
      forceRender: item.props.forceRender,
      destroyOnClose: item.props.destroyOnClose
    }, item.props.children);
  })))));
});
export default Dropdown;
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { Popover } from './popover';
const classPrefix = `adm-popover-menu`;
export const PopoverMenu = forwardRef((props, ref) => {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => innerRef.current, []);
  const onClick = useCallback(e => {
    var _a;

    const {
      onAction
    } = props;

    if (onAction) {
      onAction(e);
    }

    (_a = innerRef.current) === null || _a === void 0 ? void 0 : _a.hide();
  }, [props.onAction]);
  const overlay = useMemo(() => {
    return React.createElement("div", {
      className: `${classPrefix}-list`
    }, React.createElement("div", {
      className: `${classPrefix}-list-inner`
    }, props.actions.map((action, index) => {
      var _a;

      return React.createElement("a", {
        key: (_a = action.key) !== null && _a !== void 0 ? _a : index,
        className: classNames(`${classPrefix}-item`, 'adm-plain-anchor', action.disabled && `${classPrefix}-item-disabled`),
        onClick: () => {
          var _a;

          if (action.disabled) return;
          onClick(action);
          (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action);
        }
      }, action.icon && React.createElement("div", {
        className: `${classPrefix}-item-icon`
      }, action.icon), React.createElement("div", {
        className: `${classPrefix}-item-text`
      }, action.text));
    })));
  }, [props.actions, onClick]);
  return React.createElement(Popover, Object.assign({
    ref: innerRef
  }, props, {
    className: classNames(classPrefix, props.className),
    content: overlay
  }), props.children);
});
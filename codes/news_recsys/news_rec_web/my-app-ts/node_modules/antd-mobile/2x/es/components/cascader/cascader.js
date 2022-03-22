import React, { useState, useEffect } from 'react';
import Popup from '../popup';
import { mergeProps } from '../../utils/with-default-props';
import { withNativeProps } from '../../utils/native-props';
import { usePropsValue } from '../../utils/use-props-value';
import CascaderView from '../cascader-view';
import { useConfig } from '../config-provider';
import { useCascaderValueExtend } from '../cascader-view/use-cascader-value-extend';
const classPrefix = `adm-cascader`;
const defaultProps = {
  defaultValue: []
};
export const Cascader = p => {
  var _a;

  const {
    locale
  } = useConfig();
  const props = mergeProps(defaultProps, {
    confirmText: locale.common.confirm,
    cancelText: locale.common.cancel,
    placeholder: locale.Cascader.placeholder
  }, p);
  const [value, setValue] = usePropsValue(Object.assign(Object.assign({}, props), {
    onChange: val => {
      var _a;

      (_a = props.onConfirm) === null || _a === void 0 ? void 0 : _a.call(props, val, generateValueExtend(val));
    }
  }));
  const generateValueExtend = useCascaderValueExtend(props.options);
  const [innerValue, setInnerValue] = useState(value);
  useEffect(() => {
    if (!props.visible) {
      setInnerValue(value);
    }
  }, [props.visible]);
  useEffect(() => {
    if (!props.visible) {
      setInnerValue(value);
    }
  }, [value]);
  const cascaderElement = withNativeProps(props, React.createElement("div", {
    className: classPrefix
  }, React.createElement("div", {
    className: `${classPrefix}-header`
  }, React.createElement("a", {
    className: `${classPrefix}-header-button`,
    onClick: () => {
      var _a, _b;

      (_a = props.onCancel) === null || _a === void 0 ? void 0 : _a.call(props);
      (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
    }
  }, props.cancelText), React.createElement("div", {
    className: `${classPrefix}-header-title`
  }, props.title), React.createElement("a", {
    className: `${classPrefix}-header-button`,
    onClick: () => {
      var _a;

      setValue(innerValue);
      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  }, props.confirmText)), React.createElement("div", {
    className: `${classPrefix}-body`
  }, React.createElement(CascaderView, Object.assign({}, props, {
    value: innerValue,
    onChange: (val, ext) => {
      var _a;

      setInnerValue(val);

      if (props.visible) {
        (_a = props.onSelect) === null || _a === void 0 ? void 0 : _a.call(props, val, ext);
      }
    }
  })))));
  const popupElement = React.createElement(Popup, {
    visible: props.visible,
    position: 'bottom',
    onMaskClick: () => {
      var _a, _b;

      (_a = props.onCancel) === null || _a === void 0 ? void 0 : _a.call(props);
      (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
    },
    getContainer: props.getContainer,
    destroyOnClose: true,
    afterShow: props.afterShow,
    afterClose: props.afterClose,
    onClick: props.onClick,
    stopPropagation: props.stopPropagation
  }, cascaderElement);
  return React.createElement(React.Fragment, null, popupElement, (_a = props.children) === null || _a === void 0 ? void 0 : _a.call(props, generateValueExtend(value).items));
};
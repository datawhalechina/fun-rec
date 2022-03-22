import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import Input from '../input';
import Button from '../button';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
import { SearchOutline } from 'antd-mobile-icons';
import { usePropsValue } from '../../utils/use-props-value';
import { useConfig } from '../config-provider';
const classPrefix = `adm-search-bar`;
const defaultProps = {
  clearable: true,
  showCancelButton: false,
  defaultValue: '',
  clearOnCancel: true,
  icon: React.createElement(SearchOutline, null)
};
export const SearchBar = forwardRef((p, ref) => {
  const {
    locale
  } = useConfig();
  const props = mergeProps(defaultProps, {
    cancelText: locale.common.cancel
  }, p);
  const [value, setValue] = usePropsValue(props);
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    clear: () => {
      var _a;

      return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.clear();
    },
    focus: () => {
      var _a;

      return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    },
    blur: () => {
      var _a;

      return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    }
  }));

  const renderCancelButton = () => {
    let isShowCancel = false;

    if (typeof props.showCancelButton === 'function') {
      isShowCancel = props.showCancelButton(hasFocus, value);
    } else {
      isShowCancel = props.showCancelButton && hasFocus;
    }

    return isShowCancel && React.createElement("div", {
      className: `${classPrefix}-suffix`,
      onMouseDown: e => {
        e.preventDefault();
      },
      onTouchStart: e => {
        e.preventDefault();
      }
    }, React.createElement(Button, {
      fill: 'none',
      className: `${classPrefix}-cancel-button`,
      onClick: () => {
        var _a, _b, _c;

        if (props.clearOnCancel) {
          (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.clear();
        }

        (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.blur();
        (_c = props.onCancel) === null || _c === void 0 ? void 0 : _c.call(props);
      }
    }, props.cancelText));
  };

  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, {
      [`${classPrefix}-active`]: hasFocus
    })
  }, React.createElement("div", {
    className: `${classPrefix}-input-box`
  }, props.icon && React.createElement("div", {
    className: `${classPrefix}-input-box-icon`
  }, props.icon), React.createElement(Input, {
    ref: inputRef,
    className: classNames(`${classPrefix}-input`, {
      [`${classPrefix}-input-without-icon`]: !props.icon
    }),
    value: value,
    onChange: setValue,
    maxLength: props.maxLength,
    placeholder: props.placeholder,
    clearable: props.clearable,
    onFocus: e => {
      var _a;

      setHasFocus(true);
      (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
    },
    onBlur: e => {
      var _a;

      setHasFocus(false);
      (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
    },
    onClear: props.onClear,
    type: 'search',
    enterKeyHint: 'search',
    onEnterPress: () => {
      var _a, _b;

      (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
      (_b = props.onSearch) === null || _b === void 0 ? void 0 : _b.call(props, value);
    }
  })), renderCancelButton()));
});
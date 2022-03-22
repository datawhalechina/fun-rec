import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { mergeProps } from '../../utils/with-default-props';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
import { bound } from '../../utils/bound';
import { usePropsValue } from '../../utils/use-props-value';
const classPrefix = 'adm-passcode-input';
const defaultProps = {
  defaultValue: '',
  length: 6,
  plain: false,
  error: false,
  seperated: false,
  caret: true
};
export const PasscodeInput = forwardRef((p, ref) => {
  const props = mergeProps(defaultProps, p); // 防止 length 值不合法

  const cellLength = props.length > 0 && props.length < Infinity ? Math.floor(props.length) : defaultProps.length;
  const [focused, setFocused] = useState(false);
  const [value, setValue] = usePropsValue(props);
  const rootRef = useRef(null);
  const nativeInputRef = useRef(null);
  useEffect(() => {
    var _a;

    if (value.length >= cellLength) {
      (_a = props.onFill) === null || _a === void 0 ? void 0 : _a.call(props, value);
    }
  }, [value, cellLength]);

  const onFocus = () => {
    var _a, _b;

    if (!props.keyboard) {
      (_a = nativeInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }

    setFocused(true);
    (_b = props.onFocus) === null || _b === void 0 ? void 0 : _b.call(props);
  };

  useEffect(() => {
    if (!focused) return;
    const timeout = window.setTimeout(() => {
      var _a;

      (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth'
      });
    }, 100);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [focused]);

  const onBlur = () => {
    var _a;

    setFocused(false);
    (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props);
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      var _a;

      return (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    },
    blur: () => {
      var _a, _b;

      (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.blur();
      (_b = nativeInputRef.current) === null || _b === void 0 ? void 0 : _b.blur();
    }
  }));

  const renderCells = () => {
    const cells = [];
    const chars = value.split('');
    const caretIndex = chars.length; // 光标位置index等于当前文字长度

    const focusedIndex = bound(chars.length, 0, cellLength - 1);

    for (let i = 0; i < cellLength; i++) {
      cells.push(React.createElement("div", {
        className: classNames(`${classPrefix}-cell`, {
          caret: props.caret && caretIndex === i && focused,
          focused: focusedIndex === i && focused,
          dot: !props.plain && chars[i]
        }),
        key: i
      }, chars[i] && props.plain ? chars[i] : ''));
    }

    return cells;
  };

  const cls = classNames(classPrefix, {
    focused: focused,
    error: props.error,
    seperated: props.seperated
  });
  return React.createElement(React.Fragment, null, withNativeProps(props, React.createElement("div", {
    ref: rootRef,
    tabIndex: 0,
    className: cls,
    onFocus: onFocus,
    onBlur: onBlur
  }, React.createElement("div", {
    className: `${classPrefix}-cell-container`
  }, renderCells()), React.createElement("input", {
    ref: nativeInputRef,
    className: `${classPrefix}-native-input`,
    value: value,
    type: 'text',
    pattern: '[0-9]*',
    inputMode: 'numeric',
    onChange: e => {
      setValue(e.target.value.slice(0, props.length));
    }
  }))), props.keyboard && React.cloneElement(props.keyboard, {
    visible: focused,
    onInput: v => {
      if (value.length < cellLength) {
        setValue((value + v).slice(0, props.length));
      }
    },
    onDelete: () => {
      setValue(value.slice(0, -1));
    },
    onClose: () => {
      var _a;

      (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    }
  }));
});
import React, { useRef, useMemo } from 'react';
import classNames from 'classnames';
import { DownOutline, TextDeletionOutline } from 'antd-mobile-icons';
import { mergeProps } from '../../utils/with-default-props';
import { shuffle } from '../../utils/shuffle';
import Popup from '../popup';
import { withNativeProps } from '../../utils/native-props';
import SafeArea from '../safe-area';
import { useMemoizedFn } from 'ahooks';
const classPrefix = 'adm-number-keyboard';
const defaultProps = {
  defaultVisible: false,
  randomOrder: false,
  showCloseButton: true,
  confirmText: null,
  closeOnConfirm: true,
  safeArea: true
};
export const NumberKeyboard = p => {
  const props = mergeProps(defaultProps, p);
  const {
    visible,
    title,
    getContainer,
    confirmText,
    customKey,
    randomOrder,
    showCloseButton,
    onInput
  } = props;
  const keyboardRef = useRef(null);
  const keys = useMemo(() => {
    const defaultKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const keyList = randomOrder ? shuffle(defaultKeys) : defaultKeys;
    keyList.push('0');

    if (confirmText) {
      keyList.push(customKey || '');
    } else {
      keyList.splice(9, 0, customKey || '');
      keyList.push('BACKSPACE');
    }

    return keyList;
  }, [customKey, confirmText, randomOrder, randomOrder && visible]);
  const timeoutRef = useRef(-1);
  const intervalRef = useRef(-1);
  const onDelete = useMemoizedFn(() => {
    var _a;

    (_a = props.onDelete) === null || _a === void 0 ? void 0 : _a.call(props);
  });

  const onBackspacePressStart = () => {
    timeoutRef.current = window.setTimeout(() => {
      onDelete();
      intervalRef.current = window.setInterval(onDelete, 150);
    }, 700);
  };

  const onBackspacePressEnd = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }; // 点击键盘按键


  const onKeyPress = (e, key) => {
    var _a, _b;

    e.preventDefault();

    switch (key) {
      case 'BACKSPACE':
        onDelete === null || onDelete === void 0 ? void 0 : onDelete();
        break;

      case 'OK':
        (_a = props.onConfirm) === null || _a === void 0 ? void 0 : _a.call(props);

        if (props.closeOnConfirm) {
          (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
        }

        break;

      default:
        // 当 customKey 不存在时，点击该键不应该触发 onInput
        if (key !== '') onInput === null || onInput === void 0 ? void 0 : onInput(key);
        break;
    }
  }; // 渲染 title 和 close button


  const renderHeader = () => {
    if (!showCloseButton && !title) return null;
    return React.createElement("div", {
      className: classNames(`${classPrefix}-header`, {
        'with-title': !!title
      })
    }, title && React.createElement("div", {
      className: `${classPrefix}-title`
    }, title), showCloseButton && React.createElement("span", {
      className: `${classPrefix}-header-close-button`,
      onClick: () => {
        var _a;

        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
      },
      role: 'button',
      title: 'CLOSE'
    }, React.createElement(DownOutline, null)));
  }; // 渲染基础键盘按键


  const renderKey = (key, index) => {
    const isNumberKey = /^\d$/.test(key);
    const className = classNames(`${classPrefix}-key`, {
      'number-key': isNumberKey,
      'sign-key': !isNumberKey && key,
      'mid-key': index === 9 && !!confirmText
    });
    return React.createElement("div", {
      key: key,
      className: className,
      onTouchStart: () => {
        if (key === 'BACKSPACE') {
          onBackspacePressStart();
        }
      },
      onTouchEnd: e => {
        onKeyPress(e, key);

        if (key === 'BACKSPACE') {
          onBackspacePressEnd();
        }
      },
      onMouseUp: e => {
        onKeyPress(e, key);
      },
      title: key,
      role: 'button'
    }, key === 'BACKSPACE' ? React.createElement(TextDeletionOutline, null) : key);
  };

  return React.createElement(Popup, {
    visible: visible,
    getContainer: getContainer,
    mask: false,
    afterClose: props.afterClose,
    afterShow: props.afterShow,
    className: `${classPrefix}-popup`,
    stopPropagation: props.stopPropagation
  }, withNativeProps(props, React.createElement("div", {
    ref: keyboardRef,
    className: classPrefix,
    onMouseDown: e => {
      e.preventDefault();
    }
  }, renderHeader(), React.createElement("div", {
    className: `${classPrefix}-wrapper`
  }, React.createElement("div", {
    className: classNames(`${classPrefix}-main`, {
      'confirmed-style': !!confirmText
    })
  }, keys.map(renderKey)), !!confirmText && React.createElement("div", {
    className: `${classPrefix}-confirm`
  }, React.createElement("div", {
    className: `${classPrefix}-key extra-key bs-key`,
    onTouchStart: () => {
      onBackspacePressStart();
    },
    onTouchEnd: e => {
      onKeyPress(e, 'BACKSPACE');
      onBackspacePressEnd();
    },
    onMouseUp: e => onKeyPress(e, 'BACKSPACE'),
    title: 'BACKSPACE',
    role: 'button'
  }, React.createElement(TextDeletionOutline, null)), React.createElement("div", {
    className: `${classPrefix}-key extra-key ok-key`,
    onTouchEnd: e => onKeyPress(e, 'OK'),
    onMouseUp: e => onKeyPress(e, 'OK'),
    role: 'button'
  }, confirmText))), props.safeArea && React.createElement("div", {
    className: `${classPrefix}-footer`
  }, React.createElement(SafeArea, {
    position: 'bottom'
  })))));
};
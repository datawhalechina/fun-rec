import { __awaiter } from "tslib";
import React, { useState } from 'react';
import classNames from 'classnames';
import Button from '../button';
import { withNativeProps } from '../../utils/native-props';
export const DialogActionButton = props => {
  const {
    action
  } = props;
  const [loading, setLoading] = useState(false);

  function handleClick() {
    return __awaiter(this, void 0, void 0, function* () {
      setLoading(true);

      try {
        const promise = props.onAction();
        yield promise;
        setLoading(false);
      } catch (e) {
        setLoading(false);
        throw e;
      }
    });
  }

  return withNativeProps(props.action, React.createElement(Button, {
    key: action.key,
    onClick: handleClick,
    className: classNames('adm-dialog-button', {
      'adm-dialog-button-bold': action.bold
    }),
    fill: 'none',
    shape: 'rectangular',
    block: true,
    color: action.danger ? 'danger' : 'primary',
    loading: loading,
    disabled: action.disabled
  }, action.text));
};
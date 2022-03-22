import React from 'react';
import Form from '.';
export const FormSubscribe = ({
  children,
  to
}) => {
  return React.createElement(Form.Item, {
    noStyle: true,
    dependencies: to
  }, form => {
    const changedValues = form.getFieldsValue(to);
    return children(changedValues, form);
  });
};
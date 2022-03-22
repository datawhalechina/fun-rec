"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormSubscribe = void 0;

var _react = _interopRequireDefault(require("react"));

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FormSubscribe = ({
  children,
  to
}) => {
  return _react.default.createElement(_.default.Item, {
    noStyle: true,
    dependencies: to
  }, form => {
    const changedValues = form.getFieldsValue(to);
    return children(changedValues, form);
  });
};

exports.FormSubscribe = FormSubscribe;
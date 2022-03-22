"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withStopPropagation = withStopPropagation;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const eventToPropRecord = {
  'click': 'onClick'
};

function withStopPropagation(events, element) {
  const props = Object.assign({}, element.props);

  for (const key of events) {
    const prop = eventToPropRecord[key];

    props[prop] = function (e) {
      var _a, _b;

      e.stopPropagation();
      (_b = (_a = element.props)[prop]) === null || _b === void 0 ? void 0 : _b.call(_a, e);
    };
  }

  return _react.default.cloneElement(element, props);
}
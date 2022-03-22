import React from 'react';
const eventToPropRecord = {
  'click': 'onClick'
};
export function withStopPropagation(events, element) {
  const props = Object.assign({}, element.props);

  for (const key of events) {
    const prop = eventToPropRecord[key];

    props[prop] = function (e) {
      var _a, _b;

      e.stopPropagation();
      (_b = (_a = element.props)[prop]) === null || _b === void 0 ? void 0 : _b.call(_a, e);
    };
  }

  return React.cloneElement(element, props);
}
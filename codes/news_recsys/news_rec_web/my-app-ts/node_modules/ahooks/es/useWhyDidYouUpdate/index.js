var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

import { useEffect, useRef } from 'react';
export default function useWhyDidYouUpdate(componentName, props) {
  var prevProps = useRef({});
  useEffect(function () {
    if (prevProps.current) {
      var allKeys = Object.keys(__assign(__assign({}, prevProps.current), props));
      var changedProps_1 = {};
      allKeys.forEach(function (key) {
        if (prevProps.current[key] !== props[key]) {
          changedProps_1[key] = {
            from: prevProps.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps_1).length) {
        console.log('[why-did-you-update]', componentName, changedProps_1);
      }
    }

    prevProps.current = props;
  });
}
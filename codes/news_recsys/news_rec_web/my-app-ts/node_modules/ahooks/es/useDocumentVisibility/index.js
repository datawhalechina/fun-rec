var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

import { useState } from 'react';
import useEventListener from '../useEventListener';
import isBrowser from '../utils/isBrowser';

var getVisibility = function getVisibility() {
  if (!isBrowser) {
    return 'visible';
  }

  return document.visibilityState;
};

function useDocumentVisibility() {
  var _a = __read(useState(function () {
    return getVisibility();
  }), 2),
      documentVisibility = _a[0],
      setDocumentVisibility = _a[1];

  useEventListener('visibilitychange', function () {
    setDocumentVisibility(getVisibility());
  }, {
    target: function target() {
      return document;
    }
  });
  return documentVisibility;
}

export default useDocumentVisibility;
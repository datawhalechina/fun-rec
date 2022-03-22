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

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
  }

  return ar;
};

import { useMemo, useRef } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import useUpdate from '../useUpdate';

function useControllableValue(props, options) {
  if (props === void 0) {
    props = {};
  }

  if (options === void 0) {
    options = {};
  }

  var defaultValue = options.defaultValue,
      _a = options.defaultValuePropName,
      defaultValuePropName = _a === void 0 ? 'defaultValue' : _a,
      _b = options.valuePropName,
      valuePropName = _b === void 0 ? 'value' : _b,
      _c = options.trigger,
      trigger = _c === void 0 ? 'onChange' : _c;
  var value = props[valuePropName];
  var isControlled = (valuePropName in props);
  var initialValue = useMemo(function () {
    if (isControlled) {
      return value;
    }

    if (defaultValuePropName in props) {
      return props[defaultValuePropName];
    }

    return defaultValue;
  }, []);
  var stateRef = useRef(initialValue);

  if (isControlled) {
    stateRef.current = value;
  }

  var update = useUpdate();

  var setState = function setState(v) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    if (!isControlled) {
      stateRef.current = v;
      update();
    }

    if (props[trigger]) {
      props[trigger].apply(props, __spread([v], args));
    }
  };

  return [stateRef.current, useMemoizedFn(setState)];
}

export default useControllableValue;
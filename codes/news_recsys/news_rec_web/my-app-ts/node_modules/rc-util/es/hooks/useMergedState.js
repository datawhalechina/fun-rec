import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import useState from './useState';
/**
 * Similar to `useState` but will use props value if provided.
 * Note that internal use rc-util `useState` hook.
 */

export default function useControlledState(defaultStateValue, option) {
  var _ref = option || {},
      defaultValue = _ref.defaultValue,
      value = _ref.value,
      onChange = _ref.onChange,
      postState = _ref.postState;

  var _useState = useState(function () {
    if (value !== undefined) {
      return value;
    }

    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }

    return typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      innerValue = _useState2[0],
      setInnerValue = _useState2[1];

  var mergedValue = value !== undefined ? value : innerValue;

  if (postState) {
    mergedValue = postState(mergedValue);
  } // setState


  var onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  var triggerChange = React.useCallback(function (newValue, ignoreDestroy) {
    setInnerValue(newValue, ignoreDestroy);

    if (mergedValue !== newValue && onChangeRef.current) {
      onChangeRef.current(newValue, mergedValue);
    }
  }, [mergedValue, onChangeRef]); // Effect of reset value to `undefined`

  var firstRenderRef = React.useRef(true);
  React.useEffect(function () {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (value === undefined) {
      setInnerValue(value);
    }
  }, [value]);
  return [mergedValue, triggerChange];
}
import { useRef } from 'react';

var defaultShouldUpdate = function defaultShouldUpdate(a, b) {
  return a !== b;
};

function usePrevious(state, shouldUpdate) {
  if (shouldUpdate === void 0) {
    shouldUpdate = defaultShouldUpdate;
  }

  var prevRef = useRef();
  var curRef = useRef();

  if (shouldUpdate(curRef.current, state)) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
}

export default usePrevious;
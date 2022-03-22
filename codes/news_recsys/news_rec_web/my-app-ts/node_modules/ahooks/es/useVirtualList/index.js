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

import { useEffect, useMemo, useState, useRef } from 'react';
import useEventListener from '../useEventListener';
import useLatest from '../useLatest';
import useMemoizedFn from '../useMemoizedFn';
import useSize from '../useSize';
import { getTargetElement } from '../utils/domTarget';

var useVirtualList = function useVirtualList(list, options) {
  var containerTarget = options.containerTarget,
      wrapperTarget = options.wrapperTarget,
      itemHeight = options.itemHeight,
      _a = options.overscan,
      overscan = _a === void 0 ? 5 : _a;
  var itemHeightRef = useLatest(itemHeight);
  var size = useSize(containerTarget);
  var scrollTriggerByScrollToFunc = useRef(false);

  var _b = __read(useState([]), 2),
      targetList = _b[0],
      setTargetList = _b[1];

  var getVisibleCount = function getVisibleCount(containerHeight, fromIndex) {
    if (typeof itemHeightRef.current === 'number') {
      return Math.ceil(containerHeight / itemHeightRef.current);
    }

    var sum = 0;
    var endIndex = 0;

    for (var i = fromIndex; i < list.length; i++) {
      var height = itemHeightRef.current(i, list[i]);
      sum += height;
      endIndex = i;

      if (sum >= containerHeight) {
        break;
      }
    }

    return endIndex - fromIndex;
  };

  var getOffset = function getOffset(scrollTop) {
    if (typeof itemHeightRef.current === 'number') {
      return Math.floor(scrollTop / itemHeightRef.current) + 1;
    }

    var sum = 0;
    var offset = 0;

    for (var i = 0; i < list.length; i++) {
      var height = itemHeightRef.current(i, list[i]);
      sum += height;

      if (sum >= scrollTop) {
        offset = i;
        break;
      }
    }

    return offset + 1;
  }; // 获取上部高度


  var getDistanceTop = function getDistanceTop(index) {
    if (typeof itemHeightRef.current === 'number') {
      var height_1 = index * itemHeightRef.current;
      return height_1;
    }

    var height = list.slice(0, index) // @ts-ignore
    .reduce(function (sum, _, i) {
      return sum + itemHeightRef.current(i, list[index]);
    }, 0);
    return height;
  };

  var totalHeight = useMemo(function () {
    if (typeof itemHeightRef.current === 'number') {
      return list.length * itemHeightRef.current;
    } // @ts-ignore


    return list.reduce(function (sum, _, index) {
      return sum + itemHeightRef.current(index, list[index]);
    }, 0);
  }, [list]);

  var calculateRange = function calculateRange() {
    var container = getTargetElement(containerTarget);
    var wrapper = getTargetElement(wrapperTarget);

    if (container && wrapper) {
      var scrollTop = container.scrollTop,
          clientHeight = container.clientHeight;
      var offset = getOffset(scrollTop);
      var visibleCount = getVisibleCount(clientHeight, offset);
      var start_1 = Math.max(0, offset - overscan);
      var end = Math.min(list.length, offset + visibleCount + overscan);
      var offsetTop = getDistanceTop(start_1); // @ts-ignore

      wrapper.style.height = totalHeight - offsetTop + 'px'; // @ts-ignore

      wrapper.style.marginTop = offsetTop + 'px';
      setTargetList(list.slice(start_1, end).map(function (ele, index) {
        return {
          data: ele,
          index: index + start_1
        };
      }));
    }
  };

  useEffect(function () {
    if (!(size === null || size === void 0 ? void 0 : size.width) || !(size === null || size === void 0 ? void 0 : size.height)) {
      return;
    }

    calculateRange();
  }, [size === null || size === void 0 ? void 0 : size.width, size === null || size === void 0 ? void 0 : size.height, list]);
  useEventListener('scroll', function (e) {
    if (scrollTriggerByScrollToFunc.current) {
      scrollTriggerByScrollToFunc.current = false;
      return;
    }

    e.preventDefault();
    calculateRange();
  }, {
    target: containerTarget
  });

  var scrollTo = function scrollTo(index) {
    var container = getTargetElement(containerTarget);

    if (container) {
      scrollTriggerByScrollToFunc.current = true;
      container.scrollTop = getDistanceTop(index);
      calculateRange();
    }
  };

  return [targetList, useMemoizedFn(scrollTo)];
};

export default useVirtualList;
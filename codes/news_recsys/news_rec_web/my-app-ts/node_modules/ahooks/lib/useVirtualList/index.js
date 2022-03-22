"use strict";

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useEventListener_1 = __importDefault(require("../useEventListener"));

var useLatest_1 = __importDefault(require("../useLatest"));

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

var useSize_1 = __importDefault(require("../useSize"));

var domTarget_1 = require("../utils/domTarget");

var useVirtualList = function useVirtualList(list, options) {
  var containerTarget = options.containerTarget,
      wrapperTarget = options.wrapperTarget,
      itemHeight = options.itemHeight,
      _a = options.overscan,
      overscan = _a === void 0 ? 5 : _a;
  var itemHeightRef = useLatest_1["default"](itemHeight);
  var size = useSize_1["default"](containerTarget);
  var scrollTriggerByScrollToFunc = react_1.useRef(false);

  var _b = __read(react_1.useState([]), 2),
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

  var totalHeight = react_1.useMemo(function () {
    if (typeof itemHeightRef.current === 'number') {
      return list.length * itemHeightRef.current;
    } // @ts-ignore


    return list.reduce(function (sum, _, index) {
      return sum + itemHeightRef.current(index, list[index]);
    }, 0);
  }, [list]);

  var calculateRange = function calculateRange() {
    var container = domTarget_1.getTargetElement(containerTarget);
    var wrapper = domTarget_1.getTargetElement(wrapperTarget);

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

  react_1.useEffect(function () {
    if (!(size === null || size === void 0 ? void 0 : size.width) || !(size === null || size === void 0 ? void 0 : size.height)) {
      return;
    }

    calculateRange();
  }, [size === null || size === void 0 ? void 0 : size.width, size === null || size === void 0 ? void 0 : size.height, list]);
  useEventListener_1["default"]('scroll', function (e) {
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
    var container = domTarget_1.getTargetElement(containerTarget);

    if (container) {
      scrollTriggerByScrollToFunc.current = true;
      container.scrollTop = getDistanceTop(index);
      calculateRange();
    }
  };

  return [targetList, useMemoizedFn_1["default"](scrollTo)];
};

exports["default"] = useVirtualList;
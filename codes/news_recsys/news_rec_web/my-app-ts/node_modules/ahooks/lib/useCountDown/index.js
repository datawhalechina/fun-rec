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

var dayjs_1 = __importDefault(require("dayjs"));

var react_1 = require("react");

var useLatest_1 = __importDefault(require("../useLatest"));

var calcLeft = function calcLeft(t) {
  if (!t) {
    return 0;
  } // https://stackoverflow.com/questions/4310953/invalid-date-in-safari


  var left = dayjs_1["default"](t).valueOf() - new Date().getTime();

  if (left < 0) {
    return 0;
  }

  return left;
};

var parseMs = function parseMs(milliseconds) {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000
  };
};

var useCountdown = function useCountdown(options) {
  var _a = options || {},
      targetDate = _a.targetDate,
      _b = _a.interval,
      interval = _b === void 0 ? 1000 : _b,
      onEnd = _a.onEnd;

  var _c = __read(react_1.useState(function () {
    return calcLeft(targetDate);
  }), 2),
      timeLeft = _c[0],
      setTimeLeft = _c[1];

  var onEndRef = useLatest_1["default"](onEnd);
  react_1.useEffect(function () {
    if (!targetDate) {
      // for stop
      setTimeLeft(0);
      return;
    } // 立即执行一次


    setTimeLeft(calcLeft(targetDate));
    var timer = setInterval(function () {
      var _a;

      var targetLeft = calcLeft(targetDate);
      setTimeLeft(targetLeft);

      if (targetLeft === 0) {
        clearInterval(timer);
        (_a = onEndRef.current) === null || _a === void 0 ? void 0 : _a.call(onEndRef);
      }
    }, interval);
    return function () {
      return clearInterval(timer);
    };
  }, [targetDate, interval]);
  var formattedRes = react_1.useMemo(function () {
    return parseMs(timeLeft);
  }, [timeLeft]);
  return [timeLeft, formattedRes];
};

exports["default"] = useCountdown;
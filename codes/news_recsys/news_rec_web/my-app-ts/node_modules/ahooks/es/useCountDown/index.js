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

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import useLatest from '../useLatest';

var calcLeft = function calcLeft(t) {
  if (!t) {
    return 0;
  } // https://stackoverflow.com/questions/4310953/invalid-date-in-safari


  var left = dayjs(t).valueOf() - new Date().getTime();

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

  var _c = __read(useState(function () {
    return calcLeft(targetDate);
  }), 2),
      timeLeft = _c[0],
      setTimeLeft = _c[1];

  var onEndRef = useLatest(onEnd);
  useEffect(function () {
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
  var formattedRes = useMemo(function () {
    return parseMs(timeLeft);
  }, [timeLeft]);
  return [timeLeft, formattedRes];
};

export default useCountdown;
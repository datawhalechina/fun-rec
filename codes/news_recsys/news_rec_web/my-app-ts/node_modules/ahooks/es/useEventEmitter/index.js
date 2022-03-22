var __values = this && this.__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

import { useRef, useEffect } from 'react';

var EventEmitter =
/** @class */
function () {
  function EventEmitter() {
    var _this = this;

    this.subscriptions = new Set();

    this.emit = function (val) {
      var e_1, _a;

      try {
        for (var _b = __values(_this.subscriptions), _c = _b.next(); !_c.done; _c = _b.next()) {
          var subscription = _c.value;
          subscription(val);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    };

    this.useSubscription = function (callback) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      var callbackRef = useRef();
      callbackRef.current = callback; // eslint-disable-next-line react-hooks/rules-of-hooks

      useEffect(function () {
        function subscription(val) {
          if (callbackRef.current) {
            callbackRef.current(val);
          }
        }

        _this.subscriptions.add(subscription);

        return function () {
          _this.subscriptions["delete"](subscription);
        };
      }, []);
    };
  }

  return EventEmitter;
}();

export { EventEmitter };
export default function useEventEmitter() {
  var ref = useRef();

  if (!ref.current) {
    ref.current = new EventEmitter();
  }

  return ref.current;
}
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

import { useEffect, useState } from 'react';
var NetworkEventType;

(function (NetworkEventType) {
  NetworkEventType["ONLINE"] = "online";
  NetworkEventType["OFFLINE"] = "offline";
  NetworkEventType["CHANGE"] = "change";
})(NetworkEventType || (NetworkEventType = {}));

function getConnection() {
  var nav = navigator;
  if (typeof nav !== 'object') return null;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

function getConnectionProperty() {
  var c = getConnection();
  if (!c) return {};
  return {
    rtt: c.rtt,
    type: c.type,
    saveData: c.saveData,
    downlink: c.downlink,
    downlinkMax: c.downlinkMax,
    effectiveType: c.effectiveType
  };
}

function useNetwork() {
  var _a = __read(useState(function () {
    return __assign({
      since: undefined,
      online: navigator === null || navigator === void 0 ? void 0 : navigator.onLine
    }, getConnectionProperty());
  }), 2),
      state = _a[0],
      setState = _a[1];

  useEffect(function () {
    var onOnline = function onOnline() {
      setState(function (prevState) {
        return __assign(__assign({}, prevState), {
          online: true,
          since: new Date()
        });
      });
    };

    var onOffline = function onOffline() {
      setState(function (prevState) {
        return __assign(__assign({}, prevState), {
          online: false,
          since: new Date()
        });
      });
    };

    var onConnectionChange = function onConnectionChange() {
      setState(function (prevState) {
        return __assign(__assign({}, prevState), getConnectionProperty());
      });
    };

    window.addEventListener(NetworkEventType.ONLINE, onOnline);
    window.addEventListener(NetworkEventType.OFFLINE, onOffline);
    var connection = getConnection();
    connection === null || connection === void 0 ? void 0 : connection.addEventListener(NetworkEventType.CHANGE, onConnectionChange);
    return function () {
      window.removeEventListener(NetworkEventType.ONLINE, onOnline);
      window.removeEventListener(NetworkEventType.OFFLINE, onOffline);
      connection === null || connection === void 0 ? void 0 : connection.removeEventListener(NetworkEventType.CHANGE, onConnectionChange);
    };
  }, []);
  return state;
}

export default useNetwork;
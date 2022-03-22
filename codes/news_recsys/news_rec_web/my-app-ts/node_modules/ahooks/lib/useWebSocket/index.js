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
exports.ReadyState = void 0;

var react_1 = require("react");

var useLatest_1 = __importDefault(require("../useLatest"));

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

var useUnmount_1 = __importDefault(require("../useUnmount"));

var ReadyState;

(function (ReadyState) {
  ReadyState[ReadyState["Connecting"] = 0] = "Connecting";
  ReadyState[ReadyState["Open"] = 1] = "Open";
  ReadyState[ReadyState["Closing"] = 2] = "Closing";
  ReadyState[ReadyState["Closed"] = 3] = "Closed";
})(ReadyState = exports.ReadyState || (exports.ReadyState = {}));

function useWebSocket(socketUrl, options) {
  if (options === void 0) {
    options = {};
  }

  var _a = options.reconnectLimit,
      reconnectLimit = _a === void 0 ? 3 : _a,
      _b = options.reconnectInterval,
      reconnectInterval = _b === void 0 ? 3 * 1000 : _b,
      _c = options.manual,
      manual = _c === void 0 ? false : _c,
      onOpen = options.onOpen,
      onClose = options.onClose,
      onMessage = options.onMessage,
      onError = options.onError,
      protocols = options.protocols;
  var onOpenRef = useLatest_1["default"](onOpen);
  var onCloseRef = useLatest_1["default"](onClose);
  var onMessageRef = useLatest_1["default"](onMessage);
  var onErrorRef = useLatest_1["default"](onError);
  var reconnectTimesRef = react_1.useRef(0);
  var reconnectTimerRef = react_1.useRef();
  var websocketRef = react_1.useRef();
  var unmountedRef = react_1.useRef(false);

  var _d = __read(react_1.useState(), 2),
      latestMessage = _d[0],
      setLatestMessage = _d[1];

  var _e = __read(react_1.useState(ReadyState.Closed), 2),
      readyState = _e[0],
      setReadyState = _e[1];

  var reconnect = function reconnect() {
    var _a;

    if (reconnectTimesRef.current < reconnectLimit && ((_a = websocketRef.current) === null || _a === void 0 ? void 0 : _a.readyState) !== ReadyState.Open) {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      reconnectTimerRef.current = setTimeout(function () {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        connectWs();
        reconnectTimesRef.current++;
      }, reconnectInterval);
    }
  };

  var connectWs = function connectWs() {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    if (websocketRef.current) {
      websocketRef.current.close();
    }

    var ws = new WebSocket(socketUrl, protocols);
    setReadyState(ReadyState.Connecting);

    ws.onerror = function (event) {
      var _a;

      if (unmountedRef.current) {
        return;
      }

      reconnect();
      (_a = onErrorRef.current) === null || _a === void 0 ? void 0 : _a.call(onErrorRef, event, ws);
      setReadyState(ws.readyState || ReadyState.Closed);
    };

    ws.onopen = function (event) {
      var _a;

      if (unmountedRef.current) {
        return;
      }

      (_a = onOpenRef.current) === null || _a === void 0 ? void 0 : _a.call(onOpenRef, event, ws);
      reconnectTimesRef.current = 0;
      setReadyState(ws.readyState || ReadyState.Open);
    };

    ws.onmessage = function (message) {
      var _a;

      if (unmountedRef.current) {
        return;
      }

      (_a = onMessageRef.current) === null || _a === void 0 ? void 0 : _a.call(onMessageRef, message, ws);
      setLatestMessage(message);
    };

    ws.onclose = function (event) {
      var _a;

      if (unmountedRef.current) {
        return;
      }

      reconnect();
      (_a = onCloseRef.current) === null || _a === void 0 ? void 0 : _a.call(onCloseRef, event, ws);
      setReadyState(ws.readyState || ReadyState.Closed);
    };

    websocketRef.current = ws;
  };

  var sendMessage = function sendMessage(message) {
    var _a;

    if (readyState === ReadyState.Open) {
      (_a = websocketRef.current) === null || _a === void 0 ? void 0 : _a.send(message);
    } else {
      throw new Error('WebSocket disconnected');
    }
  };

  var connect = function connect() {
    reconnectTimesRef.current = 0;
    connectWs();
  };

  var disconnect = function disconnect() {
    var _a;

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    reconnectTimesRef.current = reconnectLimit;
    (_a = websocketRef.current) === null || _a === void 0 ? void 0 : _a.close();
  };

  react_1.useEffect(function () {
    if (!manual) {
      connect();
    }
  }, [socketUrl, manual]);
  useUnmount_1["default"](function () {
    unmountedRef.current = true;
    disconnect();
  });
  return {
    latestMessage: latestMessage,
    sendMessage: useMemoizedFn_1["default"](sendMessage),
    connect: useMemoizedFn_1["default"](connect),
    disconnect: useMemoizedFn_1["default"](disconnect),
    readyState: readyState,
    webSocketIns: websocketRef.current
  };
}

exports["default"] = useWebSocket;
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

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
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

var useAutoRunPlugin_1 = __importDefault(require("./plugins/useAutoRunPlugin"));

var useCachePlugin_1 = __importDefault(require("./plugins/useCachePlugin"));

var useDebouncePlugin_1 = __importDefault(require("./plugins/useDebouncePlugin"));

var useLoadingDelayPlugin_1 = __importDefault(require("./plugins/useLoadingDelayPlugin"));

var usePollingPlugin_1 = __importDefault(require("./plugins/usePollingPlugin"));

var useRefreshOnWindowFocusPlugin_1 = __importDefault(require("./plugins/useRefreshOnWindowFocusPlugin"));

var useRetryPlugin_1 = __importDefault(require("./plugins/useRetryPlugin"));

var useThrottlePlugin_1 = __importDefault(require("./plugins/useThrottlePlugin"));

var useRequestImplement_1 = __importDefault(require("./useRequestImplement")); // function useRequest<TData, TParams extends any[], TFormated, TTFormated extends TFormated = any>(
//   service: Service<TData, TParams>,
//   options: OptionsWithFormat<TData, TParams, TFormated, TTFormated>,
//   plugins?: Plugin<TData, TParams>[],
// ): Result<TFormated, TParams>
// function useRequest<TData, TParams extends any[]>(
//   service: Service<TData, TParams>,
//   options?: OptionsWithoutFormat<TData, TParams>,
//   plugins?: Plugin<TData, TParams>[],
// ): Result<TData, TParams>


function useRequest(service, options, plugins) {
  return useRequestImplement_1["default"](service, options, __spread(plugins || [], [useDebouncePlugin_1["default"], useLoadingDelayPlugin_1["default"], usePollingPlugin_1["default"], useRefreshOnWindowFocusPlugin_1["default"], useThrottlePlugin_1["default"], useAutoRunPlugin_1["default"], useCachePlugin_1["default"], useRetryPlugin_1["default"]]));
}

exports["default"] = useRequest;
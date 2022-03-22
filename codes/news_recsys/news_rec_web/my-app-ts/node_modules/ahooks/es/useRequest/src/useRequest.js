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

import useAutoRunPlugin from './plugins/useAutoRunPlugin';
import useCachePlugin from './plugins/useCachePlugin';
import useDebouncePlugin from './plugins/useDebouncePlugin';
import useLoadingDelayPlugin from './plugins/useLoadingDelayPlugin';
import usePollingPlugin from './plugins/usePollingPlugin';
import useRefreshOnWindowFocusPlugin from './plugins/useRefreshOnWindowFocusPlugin';
import useRetryPlugin from './plugins/useRetryPlugin';
import useThrottlePlugin from './plugins/useThrottlePlugin';
import useRequestImplement from './useRequestImplement'; // function useRequest<TData, TParams extends any[], TFormated, TTFormated extends TFormated = any>(
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
  return useRequestImplement(service, options, __spread(plugins || [], [useDebouncePlugin, useLoadingDelayPlugin, usePollingPlugin, useRefreshOnWindowFocusPlugin, useThrottlePlugin, useAutoRunPlugin, useCachePlugin, useRetryPlugin]));
}

export default useRequest;
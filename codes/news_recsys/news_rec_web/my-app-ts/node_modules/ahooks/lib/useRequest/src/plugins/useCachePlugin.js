"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
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

var react_1 = require("react");

var useCreation_1 = __importDefault(require("../../../useCreation"));

var useUnmount_1 = __importDefault(require("../../../useUnmount"));

var cache = __importStar(require("../utils/cache"));

var cachePromise = __importStar(require("../utils/cachePromise"));

var cacheSubscribe = __importStar(require("../utils/cacheSubscribe"));

var useCachePlugin = function useCachePlugin(fetchInstance, _a) {
  var cacheKey = _a.cacheKey,
      _b = _a.cacheTime,
      cacheTime = _b === void 0 ? 5 * 60 * 1000 : _b,
      _c = _a.staleTime,
      staleTime = _c === void 0 ? 0 : _c,
      customSetCache = _a.setCache,
      customGetCache = _a.getCache;
  var unSubscribeRef = react_1.useRef();
  var currentPromiseRef = react_1.useRef();

  var _setCache = function _setCache(key, cachedData) {
    if (customSetCache) {
      customSetCache(cachedData);
    } else {
      cache.setCache(key, cacheTime, cachedData);
    }

    cacheSubscribe.trigger(key, cachedData.data);
  };

  var _getCache = function _getCache(key, params) {
    if (params === void 0) {
      params = [];
    }

    if (customGetCache) {
      return customGetCache(params);
    }

    return cache.getCache(key);
  };

  useCreation_1["default"](function () {
    if (!cacheKey) {
      return;
    } // get data from cache when init


    var cacheData = _getCache(cacheKey);

    if (cacheData && Object.hasOwnProperty.call(cacheData, 'data')) {
      fetchInstance.state.data = cacheData.data;
      fetchInstance.state.params = cacheData.params;

      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        fetchInstance.state.loading = false;
      }
    } // subscribe same cachekey update, trigger update


    unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, function (data) {
      fetchInstance.setState({
        data: data
      });
    });
  }, []);
  useUnmount_1["default"](function () {
    var _a;

    (_a = unSubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unSubscribeRef);
  });

  if (!cacheKey) {
    return {};
  }

  return {
    onBefore: function onBefore(params) {
      var cacheData = _getCache(cacheKey, params);

      if (!cacheData || !Object.hasOwnProperty.call(cacheData, 'data')) {
        return {};
      } // If the data is fresh, stop request


      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        return {
          loading: false,
          data: cacheData === null || cacheData === void 0 ? void 0 : cacheData.data,
          returnNow: true
        };
      } else {
        // If the data is stale, return data, and request continue
        return {
          data: cacheData === null || cacheData === void 0 ? void 0 : cacheData.data
        };
      }
    },
    onRequest: function onRequest(service, args) {
      var servicePromise = cachePromise.getCachePromise(cacheKey); // If has servicePromise, and is not trigger by self, then use it

      if (servicePromise && servicePromise !== currentPromiseRef.current) {
        return {
          servicePromise: servicePromise
        };
      }

      servicePromise = service.apply(void 0, __spread(args));
      currentPromiseRef.current = servicePromise;
      cachePromise.setCachePromise(cacheKey, servicePromise);
      return {
        servicePromise: servicePromise
      };
    },
    onSuccess: function onSuccess(data, params) {
      var _a;

      if (cacheKey) {
        // cancel subscribe, avoid trgger self
        (_a = unSubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unSubscribeRef);

        _setCache(cacheKey, {
          data: data,
          params: params,
          time: new Date().getTime()
        }); // resubscribe


        unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, function (d) {
          fetchInstance.setState({
            data: d
          });
        });
      }
    },
    onMutate: function onMutate(data) {
      var _a;

      if (cacheKey) {
        // cancel subscribe, avoid trgger self
        (_a = unSubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unSubscribeRef);

        _setCache(cacheKey, {
          data: data,
          params: fetchInstance.state.params,
          time: new Date().getTime()
        }); // resubscribe


        unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, function (d) {
          fetchInstance.setState({
            data: d
          });
        });
      }
    }
  };
};

exports["default"] = useCachePlugin;
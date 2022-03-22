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

var cache = new Map();

var setCache = function setCache(key, cacheTime, cachedData) {
  var currentCache = cache.get(key);

  if (currentCache === null || currentCache === void 0 ? void 0 : currentCache.timer) {
    clearTimeout(currentCache.timer);
  }

  var timer = undefined;

  if (cacheTime > -1) {
    // if cache out, clear it
    timer = setTimeout(function () {
      cache["delete"](key);
    }, cacheTime);
  }

  cache.set(key, __assign(__assign({}, cachedData), {
    timer: timer
  }));
};

var getCache = function getCache(key) {
  return cache.get(key);
};

var clearCache = function clearCache(key) {
  if (key) {
    var cacheKeys = Array.isArray(key) ? key : [key];
    cacheKeys.forEach(function (cacheKey) {
      return cache["delete"](cacheKey);
    });
  } else {
    cache.clear();
  }
};

export { getCache, setCache, clearCache };
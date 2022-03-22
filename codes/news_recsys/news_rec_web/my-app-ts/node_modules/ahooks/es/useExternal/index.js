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

import { useEffect, useRef, useState } from 'react'; // {[path]: count}
// remove external when no used

var EXTERNAL_USED_COUNT = {};

var loadScript = function loadScript(path, props) {
  if (props === void 0) {
    props = {};
  }

  var script = document.querySelector("script[src=\"" + path + "\"]");

  if (!script) {
    var newScript_1 = document.createElement('script');
    newScript_1.src = path;
    Object.keys(props).forEach(function (key) {
      newScript_1[key] = props[key];
    });
    newScript_1.setAttribute('data-status', 'loading');
    document.body.appendChild(newScript_1);
    return {
      ref: newScript_1,
      status: 'loading'
    };
  }

  return {
    ref: script,
    status: script.getAttribute('data-status') || 'ready'
  };
};

var loadCss = function loadCss(path, props) {
  if (props === void 0) {
    props = {};
  }

  var css = document.querySelector("link[href=\"" + path + "\"]");

  if (!css) {
    var newCss_1 = document.createElement('link');
    newCss_1.rel = 'stylesheet';
    newCss_1.href = path;
    Object.keys(props).forEach(function (key) {
      newCss_1[key] = props[key];
    }); // IE9+

    var isLegacyIECss = ('hideFocus' in newCss_1); // use preload in IE Edge (to detect load errors)

    if (isLegacyIECss && newCss_1.relList) {
      newCss_1.rel = 'preload';
      newCss_1.as = 'style';
    }

    newCss_1.setAttribute('data-status', 'loading');
    document.head.appendChild(newCss_1);
    return {
      ref: newCss_1,
      status: 'loading'
    };
  }

  return {
    ref: css,
    status: css.getAttribute('data-status') || 'ready'
  };
};

var useExternal = function useExternal(path, options) {
  var _a = __read(useState(path ? 'loading' : 'unset'), 2),
      status = _a[0],
      setStatus = _a[1];

  var ref = useRef();
  useEffect(function () {
    if (!path) {
      setStatus('unset');
      return;
    }

    var pathname = path.replace(/[|#].*$/, '');

    if ((options === null || options === void 0 ? void 0 : options.type) === 'css' || !(options === null || options === void 0 ? void 0 : options.type) && /(^css!|\.css$)/.test(pathname)) {
      var result = loadCss(path, options === null || options === void 0 ? void 0 : options.css);
      ref.current = result.ref;
      setStatus(result.status);
    } else if ((options === null || options === void 0 ? void 0 : options.type) === 'js' || !(options === null || options === void 0 ? void 0 : options.type) && /(^js!|\.js$)/.test(pathname)) {
      var result = loadScript(path, options === null || options === void 0 ? void 0 : options.js);
      ref.current = result.ref;
      setStatus(result.status);
    } else {
      // do nothing
      console.error("Cannot infer the type of external resource, and please provide a type ('js' | 'css'). " + 'Refer to the https://ahooks.js.org/hooks/dom/use-external/#options');
    }

    if (!ref.current) {
      return;
    }

    if (EXTERNAL_USED_COUNT[path] === undefined) {
      EXTERNAL_USED_COUNT[path] = 1;
    } else {
      EXTERNAL_USED_COUNT[path] += 1;
    }

    var handler = function handler(event) {
      var _a;

      var targetStatus = event.type === 'load' ? 'ready' : 'error';
      (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setAttribute('data-status', targetStatus);
      setStatus(targetStatus);
    };

    ref.current.addEventListener('load', handler);
    ref.current.addEventListener('error', handler);
    return function () {
      var _a, _b, _c;

      (_a = ref.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('load', handler);
      (_b = ref.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('error', handler);
      EXTERNAL_USED_COUNT[path] -= 1;

      if (EXTERNAL_USED_COUNT[path] === 0) {
        (_c = ref.current) === null || _c === void 0 ? void 0 : _c.remove();
      }

      ref.current = undefined;
    };
  }, [path]);
  return status;
};

export default useExternal;
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

import useAntdTable from '../useAntdTable';
import { fieldAdapter, resultAdapter } from './fusionAdapter';

var useFusionTable = function useFusionTable(service, options) {
  if (options === void 0) {
    options = {};
  }

  var ret = useAntdTable(service, __assign(__assign({}, options), {
    form: options.field ? fieldAdapter(options.field) : undefined
  }));
  return resultAdapter(ret);
};

export default useFusionTable;
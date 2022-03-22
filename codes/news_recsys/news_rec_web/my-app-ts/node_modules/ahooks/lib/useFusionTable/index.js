"use strict";

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var useAntdTable_1 = __importDefault(require("../useAntdTable"));

var fusionAdapter_1 = require("./fusionAdapter");

var useFusionTable = function useFusionTable(service, options) {
  if (options === void 0) {
    options = {};
  }

  var ret = useAntdTable_1["default"](service, __assign(__assign({}, options), {
    form: options.field ? fusionAdapter_1.fieldAdapter(options.field) : undefined
  }));
  return fusionAdapter_1.resultAdapter(ret);
};

exports["default"] = useFusionTable;
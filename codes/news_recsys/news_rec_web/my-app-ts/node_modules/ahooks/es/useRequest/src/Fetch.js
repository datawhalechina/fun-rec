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

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
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

var Fetch =
/** @class */
function () {
  function Fetch(serviceRef, options, subscribe, initState) {
    if (initState === void 0) {
      initState = {};
    }

    this.serviceRef = serviceRef;
    this.options = options;
    this.subscribe = subscribe;
    this.initState = initState;
    this.count = 0;
    this.state = {
      loading: false,
      params: undefined,
      data: undefined,
      error: undefined
    };
    this.state = __assign(__assign(__assign({}, this.state), {
      loading: !options.manual
    }), initState);
  }

  Fetch.prototype.setState = function (s) {
    if (s === void 0) {
      s = {};
    }

    this.state = __assign(__assign({}, this.state), s);
    this.subscribe();
  };

  Fetch.prototype.runPluginHandler = function (event) {
    var rest = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      rest[_i - 1] = arguments[_i];
    } // @ts-ignore


    var r = this.pluginImpls.map(function (i) {
      var _a;

      return (_a = i[event]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spread([i], rest));
    }).filter(Boolean);
    return Object.assign.apply(Object, __spread([{}], r));
  };

  Fetch.prototype.runAsync = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;

    var params = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }

    return __awaiter(this, void 0, void 0, function () {
      var currentCount, _l, _m, stopNow, _o, returnNow, state, servicePromise, res, error_1;

      var _p;

      return __generator(this, function (_q) {
        switch (_q.label) {
          case 0:
            this.count += 1;
            currentCount = this.count;
            _l = this.runPluginHandler('onBefore', params), _m = _l.stopNow, stopNow = _m === void 0 ? false : _m, _o = _l.returnNow, returnNow = _o === void 0 ? false : _o, state = __rest(_l, ["stopNow", "returnNow"]); // stop request

            if (stopNow) {
              return [2
              /*return*/
              , new Promise(function () {})];
            }

            this.setState(__assign({
              loading: true,
              params: params
            }, state)); // return now

            if (returnNow) {
              return [2
              /*return*/
              , Promise.resolve(state.data)];
            }

            (_b = (_a = this.options).onBefore) === null || _b === void 0 ? void 0 : _b.call(_a, params);
            _q.label = 1;

          case 1:
            _q.trys.push([1, 3,, 4]);

            servicePromise = this.runPluginHandler('onRequest', this.serviceRef.current, params).servicePromise;

            if (!servicePromise) {
              servicePromise = (_p = this.serviceRef).current.apply(_p, __spread(params));
            }

            return [4
            /*yield*/
            , servicePromise];

          case 2:
            res = _q.sent();

            if (currentCount !== this.count) {
              // prevent run.then when request is canceled
              return [2
              /*return*/
              , new Promise(function () {})];
            } // const formattedResult = this.options.formatResultRef.current ? this.options.formatResultRef.current(res) : res;


            this.setState({
              data: res,
              error: undefined,
              loading: false
            });
            (_d = (_c = this.options).onSuccess) === null || _d === void 0 ? void 0 : _d.call(_c, res, params);
            this.runPluginHandler('onSuccess', res, params);
            (_f = (_e = this.options).onFinally) === null || _f === void 0 ? void 0 : _f.call(_e, params, res, undefined);

            if (currentCount === this.count) {
              this.runPluginHandler('onFinally', params, res, undefined);
            }

            return [2
            /*return*/
            , res];

          case 3:
            error_1 = _q.sent();

            if (currentCount !== this.count) {
              // prevent run.then when request is canceled
              return [2
              /*return*/
              , new Promise(function () {})];
            }

            this.setState({
              error: error_1,
              loading: false
            });
            (_h = (_g = this.options).onError) === null || _h === void 0 ? void 0 : _h.call(_g, error_1, params);
            this.runPluginHandler('onError', error_1, params);
            (_k = (_j = this.options).onFinally) === null || _k === void 0 ? void 0 : _k.call(_j, params, undefined, error_1);

            if (currentCount === this.count) {
              this.runPluginHandler('onFinally', params, undefined, error_1);
            }

            throw error_1;

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  Fetch.prototype.run = function () {
    var _this = this;

    var params = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }

    this.runAsync.apply(this, __spread(params))["catch"](function (error) {
      if (!_this.options.onError) {
        console.error(error);
      }
    });
  };

  Fetch.prototype.cancel = function () {
    this.count += 1;
    this.setState({
      loading: false
    });
    this.runPluginHandler('onCancel');
  };

  Fetch.prototype.refresh = function () {
    // @ts-ignore
    this.run.apply(this, __spread(this.state.params || []));
  };

  Fetch.prototype.refreshAsync = function () {
    // @ts-ignore
    return this.runAsync.apply(this, __spread(this.state.params || []));
  };

  Fetch.prototype.mutate = function (data) {
    var targetData;

    if (typeof data === 'function') {
      // @ts-ignore
      targetData = data(this.state.data);
    } else {
      targetData = data;
    }

    this.runPluginHandler('onMutate', targetData);
    this.setState({
      data: targetData
    });
  };

  return Fetch;
}();

export default Fetch;
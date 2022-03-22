(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom'), require('react-dom/test-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom', 'react-dom/test-utils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TestingLibraryReact = {}, global.React, global.ReactDOM, global.ReactTestUtils));
})(this, (function (exports, React, ReactDOM, testUtils) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  function _mergeNamespaces(n, m) {
    m.forEach(function (e) {
      e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
        if (k !== 'default' && !(k in n)) {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    });
    return Object.freeze(n);
  }

  var React__namespace = /*#__PURE__*/_interopNamespace(React);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var testUtils__namespace = /*#__PURE__*/_interopNamespace(testUtils);

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var runtime = {exports: {}};

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  (function (module) {
    var runtime = function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.

      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }

      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function define(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg)
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err
          };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.


      var IteratorPrototype = {};
      define(IteratorPrototype, iteratorSymbol, function () {
        return this;
      });
      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = GeneratorFunctionPrototype;
      define(Gp, "constructor", GeneratorFunctionPrototype);
      define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function (genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.


      exports.awrap = function (arg) {
        return {
          __await: arg
        };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);

          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;

            if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke("next", value, resolve, reject);
              }, function (err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function (unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function (error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise = // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).


        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);
      define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
        return this;
      });
      exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function (result) {
          return result.done ? result.value : iter.next();
        });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);

            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.


      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.


        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.


      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      define(Gp, iteratorSymbol, function () {
        return this;
      });
      define(Gp, "toString", function () {
        return "[object Generator]";
      });

      function pushTryEntry(locs) {
        var entry = {
          tryLoc: locs[0]
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{
          tryLoc: "root"
        }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function (object) {
        var keys = [];

        for (var key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length) {
            var key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.


          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1,
                next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;
              return next;
            };

            return next.next = next;
          }
        } // Return an iterator with no values.


        return {
          next: doneResult
        };
      }

      exports.values = values;

      function doneResult() {
        return {
          value: undefined$1,
          done: true
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;

          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;

          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !!caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function complete(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function finish(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function _catch(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;

              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.


          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      }; // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.

      return exports;
    }( // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports );

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, in modern engines
      // we can explicitly access globalThis. In older engines we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
  })(runtime);

  var regenerator = runtime.exports;

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  var build = {};

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  var ansiStyles = {exports: {}};

  function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, void 0, groups); }; var _super = RegExp.prototype, _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = new RegExp(re, flags); return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype); } function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { return groups[name] = result[g[name]], groups; }, Object.create(null)); } return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); return result && (result.groups = buildGroups(result, this)), result; }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if ("string" == typeof substitution) { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } if ("function" == typeof substitution) { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = arguments; return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args); }); } return _super[Symbol.replace].call(this, str, substitution); }, _wrapRegExp.apply(this, arguments); }

  (function (module) {

    var ANSI_BACKGROUND_OFFSET = 10;

    var wrapAnsi256 = function wrapAnsi256(offset) {
      if (offset === void 0) {
        offset = 0;
      }

      return function (code) {
        return "\x1B[" + (38 + offset) + ";5;" + code + "m";
      };
    };

    var wrapAnsi16m = function wrapAnsi16m(offset) {
      if (offset === void 0) {
        offset = 0;
      }

      return function (red, green, blue) {
        return "\x1B[" + (38 + offset) + ";2;" + red + ";" + green + ";" + blue + "m";
      };
    };

    function assembleStyles() {
      var codes = new Map();
      var styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          overline: [53, 55],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      }; // Alias bright black as gray (and grey)

      styles.color.gray = styles.color.blackBright;
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
      styles.color.grey = styles.color.blackBright;
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

      for (var _i = 0, _Object$entries = Object.entries(styles); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _Object$entries[_i],
            groupName = _Object$entries$_i[0],
            group = _Object$entries$_i[1];

        for (var _i2 = 0, _Object$entries2 = Object.entries(group); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _Object$entries2[_i2],
              styleName = _Object$entries2$_i[0],
              style = _Object$entries2$_i[1];
          styles[styleName] = {
            open: "\x1B[" + style[0] + "m",
            close: "\x1B[" + style[1] + "m"
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }

        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
      }

      Object.defineProperty(styles, 'codes', {
        value: codes,
        enumerable: false
      });
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      styles.color.ansi256 = wrapAnsi256();
      styles.color.ansi16m = wrapAnsi16m();
      styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
      styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET); // From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js

      Object.defineProperties(styles, {
        rgbToAnsi256: {
          value: function value(red, green, blue) {
            // We use the extended greyscale palette here, with the exception of
            // black and white. normal palette only has 4 greyscale shades.
            if (red === green && green === blue) {
              if (red < 8) {
                return 16;
              }

              if (red > 248) {
                return 231;
              }

              return Math.round((red - 8) / 247 * 24) + 232;
            }

            return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
          },
          enumerable: false
        },
        hexToRgb: {
          value: function value(hex) {
            var matches = /*#__PURE__*/_wrapRegExp(/([a-f\d]{6}|[a-f\d]{3})/i, {
              colorString: 1
            }).exec(hex.toString(16));

            if (!matches) {
              return [0, 0, 0];
            }

            var colorString = matches.groups.colorString;

            if (colorString.length === 3) {
              colorString = colorString.split('').map(function (character) {
                return character + character;
              }).join('');
            }

            var integer = Number.parseInt(colorString, 16);
            return [integer >> 16 & 0xFF, integer >> 8 & 0xFF, integer & 0xFF];
          },
          enumerable: false
        },
        hexToAnsi256: {
          value: function value(hex) {
            return styles.rgbToAnsi256.apply(styles, styles.hexToRgb(hex));
          },
          enumerable: false
        }
      });
      return styles;
    } // Make the export immutable


    Object.defineProperty(module, 'exports', {
      enumerable: true,
      get: assembleStyles
    });
  })(ansiStyles);

  var collections = {};

  Object.defineProperty(collections, '__esModule', {
    value: true
  });
  collections.printIteratorEntries = printIteratorEntries;
  collections.printIteratorValues = printIteratorValues;
  collections.printListItems = printListItems;
  collections.printObjectProperties = printObjectProperties;
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  var getKeysOfEnumerableProperties = function getKeysOfEnumerableProperties(object, compareKeys) {
    var keys = Object.keys(object).sort(compareKeys);

    if (Object.getOwnPropertySymbols) {
      Object.getOwnPropertySymbols(object).forEach(function (symbol) {
        if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
          keys.push(symbol);
        }
      });
    }

    return keys;
  };
  /**
   * Return entries (for example, of a map)
   * with spacing, indentation, and comma
   * without surrounding punctuation (for example, braces)
   */


  function printIteratorEntries(iterator, config, indentation, depth, refs, printer, // Too bad, so sad that separator for ECMAScript Map has been ' => '
  // What a distracting diff if you change a data structure to/from
  // ECMAScript Object or Immutable.Map/OrderedMap which use the default.
  separator) {
    if (separator === void 0) {
      separator = ': ';
    }

    var result = '';
    var current = iterator.next();

    if (!current.done) {
      result += config.spacingOuter;
      var indentationNext = indentation + config.indent;

      while (!current.done) {
        var name = printer(current.value[0], config, indentationNext, depth, refs);
        var value = printer(current.value[1], config, indentationNext, depth, refs);
        result += indentationNext + name + separator + value;
        current = iterator.next();

        if (!current.done) {
          result += ',' + config.spacingInner;
        } else if (!config.min) {
          result += ',';
        }
      }

      result += config.spacingOuter + indentation;
    }

    return result;
  }
  /**
   * Return values (for example, of a set)
   * with spacing, indentation, and comma
   * without surrounding punctuation (braces or brackets)
   */


  function printIteratorValues(iterator, config, indentation, depth, refs, printer) {
    var result = '';
    var current = iterator.next();

    if (!current.done) {
      result += config.spacingOuter;
      var indentationNext = indentation + config.indent;

      while (!current.done) {
        result += indentationNext + printer(current.value, config, indentationNext, depth, refs);
        current = iterator.next();

        if (!current.done) {
          result += ',' + config.spacingInner;
        } else if (!config.min) {
          result += ',';
        }
      }

      result += config.spacingOuter + indentation;
    }

    return result;
  }
  /**
   * Return items (for example, of an array)
   * with spacing, indentation, and comma
   * without surrounding punctuation (for example, brackets)
   **/


  function printListItems(list, config, indentation, depth, refs, printer) {
    var result = '';

    if (list.length) {
      result += config.spacingOuter;
      var indentationNext = indentation + config.indent;

      for (var i = 0; i < list.length; i++) {
        result += indentationNext;

        if (i in list) {
          result += printer(list[i], config, indentationNext, depth, refs);
        }

        if (i < list.length - 1) {
          result += ',' + config.spacingInner;
        } else if (!config.min) {
          result += ',';
        }
      }

      result += config.spacingOuter + indentation;
    }

    return result;
  }
  /**
   * Return properties of an object
   * with spacing, indentation, and comma
   * without surrounding punctuation (for example, braces)
   */


  function printObjectProperties(val, config, indentation, depth, refs, printer) {
    var result = '';
    var keys = getKeysOfEnumerableProperties(val, config.compareKeys);

    if (keys.length) {
      result += config.spacingOuter;
      var indentationNext = indentation + config.indent;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var name = printer(key, config, indentationNext, depth, refs);
        var value = printer(val[key], config, indentationNext, depth, refs);
        result += indentationNext + name + ': ' + value;

        if (i < keys.length - 1) {
          result += ',' + config.spacingInner;
        } else if (!config.min) {
          result += ',';
        }
      }

      result += config.spacingOuter + indentation;
    }

    return result;
  }

  var AsymmetricMatcher = {};

  Object.defineProperty(AsymmetricMatcher, '__esModule', {
    value: true
  });
  AsymmetricMatcher.test = AsymmetricMatcher.serialize = AsymmetricMatcher.default = void 0;
  var _collections$3 = collections;

  var global$1 = function () {
    if (typeof globalThis !== 'undefined') {
      return globalThis;
    } else if (typeof global$1 !== 'undefined') {
      return global$1;
    } else if (typeof self !== 'undefined') {
      return self;
    } else if (typeof window !== 'undefined') {
      return window;
    } else {
      return Function('return this')();
    }
  }();

  var Symbol$2 = global$1['jest-symbol-do-not-touch'] || global$1.Symbol;
  var asymmetricMatcher = typeof Symbol$2 === 'function' && Symbol$2.for ? Symbol$2.for('jest.asymmetricMatcher') : 0x1357a5;
  var SPACE$2 = ' ';

  var serialize$6 = function serialize(val, config, indentation, depth, refs, printer) {
    var stringedValue = val.toString();

    if (stringedValue === 'ArrayContaining' || stringedValue === 'ArrayNotContaining') {
      if (++depth > config.maxDepth) {
        return '[' + stringedValue + ']';
      }

      return stringedValue + SPACE$2 + '[' + (0, _collections$3.printListItems)(val.sample, config, indentation, depth, refs, printer) + ']';
    }

    if (stringedValue === 'ObjectContaining' || stringedValue === 'ObjectNotContaining') {
      if (++depth > config.maxDepth) {
        return '[' + stringedValue + ']';
      }

      return stringedValue + SPACE$2 + '{' + (0, _collections$3.printObjectProperties)(val.sample, config, indentation, depth, refs, printer) + '}';
    }

    if (stringedValue === 'StringMatching' || stringedValue === 'StringNotMatching') {
      return stringedValue + SPACE$2 + printer(val.sample, config, indentation, depth, refs);
    }

    if (stringedValue === 'StringContaining' || stringedValue === 'StringNotContaining') {
      return stringedValue + SPACE$2 + printer(val.sample, config, indentation, depth, refs);
    }

    return val.toAsymmetricMatcher();
  };

  AsymmetricMatcher.serialize = serialize$6;

  var test$6 = function test(val) {
    return val && val.$$typeof === asymmetricMatcher;
  };

  AsymmetricMatcher.test = test$6;
  var plugin$6 = {
    serialize: serialize$6,
    test: test$6
  };
  var _default$2k = plugin$6;
  AsymmetricMatcher.default = _default$2k;

  var ConvertAnsi = {};

  var ansiRegex = function ansiRegex(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$onlyFirst = _ref.onlyFirst,
        onlyFirst = _ref$onlyFirst === void 0 ? false : _ref$onlyFirst;

    var pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'].join('|');
    return new RegExp(pattern, onlyFirst ? undefined : 'g');
  };

  Object.defineProperty(ConvertAnsi, '__esModule', {
    value: true
  });
  ConvertAnsi.test = ConvertAnsi.serialize = ConvertAnsi.default = void 0;

  var _ansiRegex = _interopRequireDefault$9(ansiRegex);

  var _ansiStyles$1 = _interopRequireDefault$9(ansiStyles.exports);

  function _interopRequireDefault$9(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */


  var toHumanReadableAnsi = function toHumanReadableAnsi(text) {
    return text.replace((0, _ansiRegex.default)(), function (match) {
      switch (match) {
        case _ansiStyles$1.default.red.close:
        case _ansiStyles$1.default.green.close:
        case _ansiStyles$1.default.cyan.close:
        case _ansiStyles$1.default.gray.close:
        case _ansiStyles$1.default.white.close:
        case _ansiStyles$1.default.yellow.close:
        case _ansiStyles$1.default.bgRed.close:
        case _ansiStyles$1.default.bgGreen.close:
        case _ansiStyles$1.default.bgYellow.close:
        case _ansiStyles$1.default.inverse.close:
        case _ansiStyles$1.default.dim.close:
        case _ansiStyles$1.default.bold.close:
        case _ansiStyles$1.default.reset.open:
        case _ansiStyles$1.default.reset.close:
          return '</>';

        case _ansiStyles$1.default.red.open:
          return '<red>';

        case _ansiStyles$1.default.green.open:
          return '<green>';

        case _ansiStyles$1.default.cyan.open:
          return '<cyan>';

        case _ansiStyles$1.default.gray.open:
          return '<gray>';

        case _ansiStyles$1.default.white.open:
          return '<white>';

        case _ansiStyles$1.default.yellow.open:
          return '<yellow>';

        case _ansiStyles$1.default.bgRed.open:
          return '<bgRed>';

        case _ansiStyles$1.default.bgGreen.open:
          return '<bgGreen>';

        case _ansiStyles$1.default.bgYellow.open:
          return '<bgYellow>';

        case _ansiStyles$1.default.inverse.open:
          return '<inverse>';

        case _ansiStyles$1.default.dim.open:
          return '<dim>';

        case _ansiStyles$1.default.bold.open:
          return '<bold>';

        default:
          return '';
      }
    });
  };

  var test$5 = function test(val) {
    return typeof val === 'string' && !!val.match((0, _ansiRegex.default)());
  };

  ConvertAnsi.test = test$5;

  var serialize$5 = function serialize(val, config, indentation, depth, refs, printer) {
    return printer(toHumanReadableAnsi(val), config, indentation, depth, refs);
  };

  ConvertAnsi.serialize = serialize$5;
  var plugin$5 = {
    serialize: serialize$5,
    test: test$5
  };
  var _default$2j = plugin$5;
  ConvertAnsi.default = _default$2j;

  var DOMCollection$1 = {};

  Object.defineProperty(DOMCollection$1, '__esModule', {
    value: true
  });
  DOMCollection$1.test = DOMCollection$1.serialize = DOMCollection$1.default = void 0;
  var _collections$2 = collections;
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  /* eslint-disable local/ban-types-eventually */

  var SPACE$1 = ' ';
  var OBJECT_NAMES = ['DOMStringMap', 'NamedNodeMap'];
  var ARRAY_REGEXP = /^(HTML\w*Collection|NodeList)$/;

  var testName = function testName(name) {
    return OBJECT_NAMES.indexOf(name) !== -1 || ARRAY_REGEXP.test(name);
  };

  var test$4 = function test(val) {
    return val && val.constructor && !!val.constructor.name && testName(val.constructor.name);
  };

  DOMCollection$1.test = test$4;

  var isNamedNodeMap = function isNamedNodeMap(collection) {
    return collection.constructor.name === 'NamedNodeMap';
  };

  var serialize$4 = function serialize(collection, config, indentation, depth, refs, printer) {
    var name = collection.constructor.name;

    if (++depth > config.maxDepth) {
      return '[' + name + ']';
    }

    return (config.min ? '' : name + SPACE$1) + (OBJECT_NAMES.indexOf(name) !== -1 ? '{' + (0, _collections$2.printObjectProperties)(isNamedNodeMap(collection) ? Array.from(collection).reduce(function (props, attribute) {
      props[attribute.name] = attribute.value;
      return props;
    }, {}) : _extends({}, collection), config, indentation, depth, refs, printer) + '}' : '[' + (0, _collections$2.printListItems)(Array.from(collection), config, indentation, depth, refs, printer) + ']');
  };

  DOMCollection$1.serialize = serialize$4;
  var plugin$4 = {
    serialize: serialize$4,
    test: test$4
  };
  var _default$2i = plugin$4;
  DOMCollection$1.default = _default$2i;

  var DOMElement = {};

  var markup = {};

  var escapeHTML$2 = {};

  Object.defineProperty(escapeHTML$2, '__esModule', {
    value: true
  });

  escapeHTML$2.default = escapeHTML$1;
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */


  function escapeHTML$1(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  Object.defineProperty(markup, '__esModule', {
    value: true
  });
  markup.printText = markup.printProps = markup.printElementAsLeaf = markup.printElement = markup.printComment = markup.printChildren = void 0;

  var _escapeHTML = _interopRequireDefault$8(escapeHTML$2);

  function _interopRequireDefault$8(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  // Return empty string if keys is empty.


  var printProps$1 = function printProps(keys, props, config, indentation, depth, refs, printer) {
    var indentationNext = indentation + config.indent;
    var colors = config.colors;
    return keys.map(function (key) {
      var value = props[key];
      var printed = printer(value, config, indentationNext, depth, refs);

      if (typeof value !== 'string') {
        if (printed.indexOf('\n') !== -1) {
          printed = config.spacingOuter + indentationNext + printed + config.spacingOuter + indentation;
        }

        printed = '{' + printed + '}';
      }

      return config.spacingInner + indentation + colors.prop.open + key + colors.prop.close + '=' + colors.value.open + printed + colors.value.close;
    }).join('');
  }; // Return empty string if children is empty.


  markup.printProps = printProps$1;

  var printChildren$1 = function printChildren(children, config, indentation, depth, refs, printer) {
    return children.map(function (child) {
      return config.spacingOuter + indentation + (typeof child === 'string' ? printText$1(child, config) : printer(child, config, indentation, depth, refs));
    }).join('');
  };

  markup.printChildren = printChildren$1;

  var printText$1 = function printText(text, config) {
    var contentColor = config.colors.content;
    return contentColor.open + (0, _escapeHTML.default)(text) + contentColor.close;
  };

  markup.printText = printText$1;

  var printComment$1 = function printComment(comment, config) {
    var commentColor = config.colors.comment;
    return commentColor.open + '<!--' + (0, _escapeHTML.default)(comment) + '-->' + commentColor.close;
  }; // Separate the functions to format props, children, and element,
  // so a plugin could override a particular function, if needed.
  // Too bad, so sad: the traditional (but unnecessary) space
  // in a self-closing tagColor requires a second test of printedProps.


  markup.printComment = printComment$1;

  var printElement$1 = function printElement(type, printedProps, printedChildren, config, indentation) {
    var tagColor = config.colors.tag;
    return tagColor.open + '<' + type + (printedProps && tagColor.close + printedProps + config.spacingOuter + indentation + tagColor.open) + (printedChildren ? '>' + tagColor.close + printedChildren + config.spacingOuter + indentation + tagColor.open + '</' + type : (printedProps && !config.min ? '' : ' ') + '/') + '>' + tagColor.close;
  };

  markup.printElement = printElement$1;

  var printElementAsLeaf$1 = function printElementAsLeaf(type, config) {
    var tagColor = config.colors.tag;
    return tagColor.open + '<' + type + tagColor.close + ' …' + tagColor.open + ' />' + tagColor.close;
  };

  markup.printElementAsLeaf = printElementAsLeaf$1;

  Object.defineProperty(DOMElement, '__esModule', {
    value: true
  });
  DOMElement.test = DOMElement.serialize = DOMElement.default = void 0;
  var _markup$2 = markup;
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ELEMENT_NODE$2 = 1;
  var TEXT_NODE$2 = 3;
  var COMMENT_NODE$2 = 8;
  var FRAGMENT_NODE$1 = 11;
  var ELEMENT_REGEXP$1 = /^((HTML|SVG)\w*)?Element$/;

  var testHasAttribute = function testHasAttribute(val) {
    try {
      return typeof val.hasAttribute === 'function' && val.hasAttribute('is');
    } catch (_unused) {
      return false;
    }
  };

  var testNode$1 = function testNode(val) {
    var constructorName = val.constructor.name;
    var nodeType = val.nodeType,
        tagName = val.tagName;
    var isCustomElement = typeof tagName === 'string' && tagName.includes('-') || testHasAttribute(val);
    return nodeType === ELEMENT_NODE$2 && (ELEMENT_REGEXP$1.test(constructorName) || isCustomElement) || nodeType === TEXT_NODE$2 && constructorName === 'Text' || nodeType === COMMENT_NODE$2 && constructorName === 'Comment' || nodeType === FRAGMENT_NODE$1 && constructorName === 'DocumentFragment';
  };

  var test$3 = function test(val) {
    var _val$constructor;

    return (val === null || val === void 0 ? void 0 : (_val$constructor = val.constructor) === null || _val$constructor === void 0 ? void 0 : _val$constructor.name) && testNode$1(val);
  };

  DOMElement.test = test$3;

  function nodeIsText$1(node) {
    return node.nodeType === TEXT_NODE$2;
  }

  function nodeIsComment$1(node) {
    return node.nodeType === COMMENT_NODE$2;
  }

  function nodeIsFragment$1(node) {
    return node.nodeType === FRAGMENT_NODE$1;
  }

  var serialize$3 = function serialize(node, config, indentation, depth, refs, printer) {
    if (nodeIsText$1(node)) {
      return (0, _markup$2.printText)(node.data, config);
    }

    if (nodeIsComment$1(node)) {
      return (0, _markup$2.printComment)(node.data, config);
    }

    var type = nodeIsFragment$1(node) ? 'DocumentFragment' : node.tagName.toLowerCase();

    if (++depth > config.maxDepth) {
      return (0, _markup$2.printElementAsLeaf)(type, config);
    }

    return (0, _markup$2.printElement)(type, (0, _markup$2.printProps)(nodeIsFragment$1(node) ? [] : Array.from(node.attributes).map(function (attr) {
      return attr.name;
    }).sort(), nodeIsFragment$1(node) ? {} : Array.from(node.attributes).reduce(function (props, attribute) {
      props[attribute.name] = attribute.value;
      return props;
    }, {}), config, indentation + config.indent, depth, refs, printer), (0, _markup$2.printChildren)(Array.prototype.slice.call(node.childNodes || node.children), config, indentation + config.indent, depth, refs, printer), config, indentation);
  };

  DOMElement.serialize = serialize$3;
  var plugin$3 = {
    serialize: serialize$3,
    test: test$3
  };
  var _default$2h = plugin$3;
  DOMElement.default = _default$2h;

  var Immutable = {};

  Object.defineProperty(Immutable, '__esModule', {
    value: true
  });
  Immutable.test = Immutable.serialize = Immutable.default = void 0;
  var _collections$1 = collections;
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  // SENTINEL constants are from https://github.com/facebook/immutable-js

  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
  var IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@'; // immutable v4

  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';
  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

  var getImmutableName = function getImmutableName(name) {
    return 'Immutable.' + name;
  };

  var printAsLeaf = function printAsLeaf(name) {
    return '[' + name + ']';
  };

  var SPACE = ' ';
  var LAZY = '…'; // Seq is lazy if it calls a method like filter

  var printImmutableEntries = function printImmutableEntries(val, config, indentation, depth, refs, printer, type) {
    return ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : getImmutableName(type) + SPACE + '{' + (0, _collections$1.printIteratorEntries)(val.entries(), config, indentation, depth, refs, printer) + '}';
  }; // Record has an entries method because it is a collection in immutable v3.
  // Return an iterator for Immutable Record from version v3 or v4.


  function getRecordEntries(val) {
    var i = 0;
    return {
      next: function next() {
        if (i < val._keys.length) {
          var key = val._keys[i++];
          return {
            done: false,
            value: [key, val.get(key)]
          };
        }

        return {
          done: true,
          value: undefined
        };
      }
    };
  }

  var printImmutableRecord = function printImmutableRecord(val, config, indentation, depth, refs, printer) {
    // _name property is defined only for an Immutable Record instance
    // which was constructed with a second optional descriptive name arg
    var name = getImmutableName(val._name || 'Record');
    return ++depth > config.maxDepth ? printAsLeaf(name) : name + SPACE + '{' + (0, _collections$1.printIteratorEntries)(getRecordEntries(val), config, indentation, depth, refs, printer) + '}';
  };

  var printImmutableSeq = function printImmutableSeq(val, config, indentation, depth, refs, printer) {
    var name = getImmutableName('Seq');

    if (++depth > config.maxDepth) {
      return printAsLeaf(name);
    }

    if (val[IS_KEYED_SENTINEL]) {
      return name + SPACE + '{' + ( // from Immutable collection of entries or from ECMAScript object
      val._iter || val._object ? (0, _collections$1.printIteratorEntries)(val.entries(), config, indentation, depth, refs, printer) : LAZY) + '}';
    }

    return name + SPACE + '[' + (val._iter || // from Immutable collection of values
    val._array || // from ECMAScript array
    val._collection || // from ECMAScript collection in immutable v4
    val._iterable // from ECMAScript collection in immutable v3
    ? (0, _collections$1.printIteratorValues)(val.values(), config, indentation, depth, refs, printer) : LAZY) + ']';
  };

  var printImmutableValues = function printImmutableValues(val, config, indentation, depth, refs, printer, type) {
    return ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : getImmutableName(type) + SPACE + '[' + (0, _collections$1.printIteratorValues)(val.values(), config, indentation, depth, refs, printer) + ']';
  };

  var serialize$2 = function serialize(val, config, indentation, depth, refs, printer) {
    if (val[IS_MAP_SENTINEL]) {
      return printImmutableEntries(val, config, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL] ? 'OrderedMap' : 'Map');
    }

    if (val[IS_LIST_SENTINEL]) {
      return printImmutableValues(val, config, indentation, depth, refs, printer, 'List');
    }

    if (val[IS_SET_SENTINEL]) {
      return printImmutableValues(val, config, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL] ? 'OrderedSet' : 'Set');
    }

    if (val[IS_STACK_SENTINEL]) {
      return printImmutableValues(val, config, indentation, depth, refs, printer, 'Stack');
    }

    if (val[IS_SEQ_SENTINEL]) {
      return printImmutableSeq(val, config, indentation, depth, refs, printer);
    } // For compatibility with immutable v3 and v4, let record be the default.


    return printImmutableRecord(val, config, indentation, depth, refs, printer);
  }; // Explicitly comparing sentinel properties to true avoids false positive
  // when mock identity-obj-proxy returns the key as the value for any key.


  Immutable.serialize = serialize$2;

  var test$2 = function test(val) {
    return val && (val[IS_ITERABLE_SENTINEL] === true || val[IS_RECORD_SENTINEL] === true);
  };

  Immutable.test = test$2;
  var plugin$2 = {
    serialize: serialize$2,
    test: test$2
  };
  var _default$2g = plugin$2;
  Immutable.default = _default$2g;

  var ReactElement = {};

  var reactIs = {exports: {}};

  /** @license React v17.0.2
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  if ("function" === typeof Symbol && Symbol.for) {
    var x = Symbol.for;
    x("react.element");
    x("react.portal");
    x("react.fragment");
    x("react.strict_mode");
    x("react.profiler");
    x("react.provider");
    x("react.context");
    x("react.forward_ref");
    x("react.suspense");
    x("react.suspense_list");
    x("react.memo");
    x("react.lazy");
    x("react.block");
    x("react.server.block");
    x("react.fundamental");
    x("react.debug_trace_mode");
    x("react.legacy_hidden");
  }

  var reactIs_development = {};

  /** @license React v17.0.2
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    (function () {
      // When adding new symbols to this file,
      // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
      // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
      // nor polyfill, then a plain number is used for performance.

      var REACT_ELEMENT_TYPE = 0xeac7;
      var REACT_PORTAL_TYPE = 0xeaca;
      var REACT_FRAGMENT_TYPE = 0xeacb;
      var REACT_STRICT_MODE_TYPE = 0xeacc;
      var REACT_PROFILER_TYPE = 0xead2;
      var REACT_PROVIDER_TYPE = 0xeacd;
      var REACT_CONTEXT_TYPE = 0xeace;
      var REACT_FORWARD_REF_TYPE = 0xead0;
      var REACT_SUSPENSE_TYPE = 0xead1;
      var REACT_SUSPENSE_LIST_TYPE = 0xead8;
      var REACT_MEMO_TYPE = 0xead3;
      var REACT_LAZY_TYPE = 0xead4;
      var REACT_BLOCK_TYPE = 0xead9;
      var REACT_SERVER_BLOCK_TYPE = 0xeada;
      var REACT_FUNDAMENTAL_TYPE = 0xead5;
      var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
      var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

      if (typeof Symbol === 'function' && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor('react.element');
        REACT_PORTAL_TYPE = symbolFor('react.portal');
        REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
        REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
        REACT_PROFILER_TYPE = symbolFor('react.profiler');
        REACT_PROVIDER_TYPE = symbolFor('react.provider');
        REACT_CONTEXT_TYPE = symbolFor('react.context');
        REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
        REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
        REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
        REACT_MEMO_TYPE = symbolFor('react.memo');
        REACT_LAZY_TYPE = symbolFor('react.lazy');
        REACT_BLOCK_TYPE = symbolFor('react.block');
        REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
        REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
        symbolFor('react.scope');
        symbolFor('react.opaque.id');
        REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
        symbolFor('react.offscreen');
        REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
      } // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.


      var enableScopeAPI = false; // Experimental Create Event Handle API.

      function isValidElementType(type) {
        if (typeof type === 'string' || typeof type === 'function') {
          return true;
        } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI) {
          return true;
        }

        if (typeof type === 'object' && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
            return true;
          }
        }

        return false;
      }

      function typeOf(object) {
        if (typeof object === 'object' && object !== null) {
          var $$typeof = object.$$typeof;

          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;

              switch (type) {
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                case REACT_SUSPENSE_LIST_TYPE:
                  return type;

                default:
                  var $$typeofType = type && type.$$typeof;

                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;

                    default:
                      return $$typeof;
                  }

              }

            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }

        return undefined;
      }

      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated

      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

            console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
          }
        }
        return false;
      }

      function isConcurrentMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
            hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint

            console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
          }
        }
        return false;
      }

      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }

      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }

      function isElement(object) {
        return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }

      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }

      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }

      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }

      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }

      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }

      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }

      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }

      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }

      reactIs_development.ContextConsumer = ContextConsumer;
      reactIs_development.ContextProvider = ContextProvider;
      reactIs_development.Element = Element;
      reactIs_development.ForwardRef = ForwardRef;
      reactIs_development.Fragment = Fragment;
      reactIs_development.Lazy = Lazy;
      reactIs_development.Memo = Memo;
      reactIs_development.Portal = Portal;
      reactIs_development.Profiler = Profiler;
      reactIs_development.StrictMode = StrictMode;
      reactIs_development.Suspense = Suspense;
      reactIs_development.isAsyncMode = isAsyncMode;
      reactIs_development.isConcurrentMode = isConcurrentMode;
      reactIs_development.isContextConsumer = isContextConsumer;
      reactIs_development.isContextProvider = isContextProvider;
      reactIs_development.isElement = isElement;
      reactIs_development.isForwardRef = isForwardRef;
      reactIs_development.isFragment = isFragment;
      reactIs_development.isLazy = isLazy;
      reactIs_development.isMemo = isMemo;
      reactIs_development.isPortal = isPortal;
      reactIs_development.isProfiler = isProfiler;
      reactIs_development.isStrictMode = isStrictMode;
      reactIs_development.isSuspense = isSuspense;
      reactIs_development.isValidElementType = isValidElementType;
      reactIs_development.typeOf = typeOf;
    })();
  }

  {
    reactIs.exports = reactIs_development;
  }

  Object.defineProperty(ReactElement, '__esModule', {
    value: true
  });
  ReactElement.test = ReactElement.serialize = ReactElement.default = void 0;

  var ReactIs = _interopRequireWildcard(reactIs.exports);

  var _markup$1 = markup;

  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== 'function') return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
      return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }

  function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || typeof obj !== 'object' && typeof obj !== 'function') {
      return {
        default: obj
      };
    }

    var cache = _getRequireWildcardCache(nodeInterop);

    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
      if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    newObj.default = obj;

    if (cache) {
      cache.set(obj, newObj);
    }

    return newObj;
  }
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  // Given element.props.children, or subtree during recursive traversal,
  // return flattened array of children.


  var getChildren = function getChildren(arg, children) {
    if (children === void 0) {
      children = [];
    }

    if (Array.isArray(arg)) {
      arg.forEach(function (item) {
        getChildren(item, children);
      });
    } else if (arg != null && arg !== false) {
      children.push(arg);
    }

    return children;
  };

  var getType = function getType(element) {
    var type = element.type;

    if (typeof type === 'string') {
      return type;
    }

    if (typeof type === 'function') {
      return type.displayName || type.name || 'Unknown';
    }

    if (ReactIs.isFragment(element)) {
      return 'React.Fragment';
    }

    if (ReactIs.isSuspense(element)) {
      return 'React.Suspense';
    }

    if (typeof type === 'object' && type !== null) {
      if (ReactIs.isContextProvider(element)) {
        return 'Context.Provider';
      }

      if (ReactIs.isContextConsumer(element)) {
        return 'Context.Consumer';
      }

      if (ReactIs.isForwardRef(element)) {
        if (type.displayName) {
          return type.displayName;
        }

        var functionName = type.render.displayName || type.render.name || '';
        return functionName !== '' ? 'ForwardRef(' + functionName + ')' : 'ForwardRef';
      }

      if (ReactIs.isMemo(element)) {
        var _functionName = type.displayName || type.type.displayName || type.type.name || '';

        return _functionName !== '' ? 'Memo(' + _functionName + ')' : 'Memo';
      }
    }

    return 'UNDEFINED';
  };

  var getPropKeys$1 = function getPropKeys(element) {
    var props = element.props;
    return Object.keys(props).filter(function (key) {
      return key !== 'children' && props[key] !== undefined;
    }).sort();
  };

  var serialize$1 = function serialize(element, config, indentation, depth, refs, printer) {
    return ++depth > config.maxDepth ? (0, _markup$1.printElementAsLeaf)(getType(element), config) : (0, _markup$1.printElement)(getType(element), (0, _markup$1.printProps)(getPropKeys$1(element), element.props, config, indentation + config.indent, depth, refs, printer), (0, _markup$1.printChildren)(getChildren(element.props.children), config, indentation + config.indent, depth, refs, printer), config, indentation);
  };

  ReactElement.serialize = serialize$1;

  var test$1 = function test(val) {
    return val != null && ReactIs.isElement(val);
  };

  ReactElement.test = test$1;
  var plugin$1 = {
    serialize: serialize$1,
    test: test$1
  };
  var _default$2f = plugin$1;
  ReactElement.default = _default$2f;

  var ReactTestComponent = {};

  Object.defineProperty(ReactTestComponent, '__esModule', {
    value: true
  });
  ReactTestComponent.test = ReactTestComponent.serialize = ReactTestComponent.default = void 0;
  var _markup = markup;

  var global = function () {
    if (typeof globalThis !== 'undefined') {
      return globalThis;
    } else if (typeof global !== 'undefined') {
      return global;
    } else if (typeof self !== 'undefined') {
      return self;
    } else if (typeof window !== 'undefined') {
      return window;
    } else {
      return Function('return this')();
    }
  }();

  var Symbol$1 = global['jest-symbol-do-not-touch'] || global.Symbol;
  var testSymbol = typeof Symbol$1 === 'function' && Symbol$1.for ? Symbol$1.for('react.test.json') : 0xea71357;

  var getPropKeys = function getPropKeys(object) {
    var props = object.props;
    return props ? Object.keys(props).filter(function (key) {
      return props[key] !== undefined;
    }).sort() : [];
  };

  var serialize = function serialize(object, config, indentation, depth, refs, printer) {
    return ++depth > config.maxDepth ? (0, _markup.printElementAsLeaf)(object.type, config) : (0, _markup.printElement)(object.type, object.props ? (0, _markup.printProps)(getPropKeys(object), object.props, config, indentation + config.indent, depth, refs, printer) : '', object.children ? (0, _markup.printChildren)(object.children, config, indentation + config.indent, depth, refs, printer) : '', config, indentation);
  };

  ReactTestComponent.serialize = serialize;

  var test = function test(val) {
    return val && val.$$typeof === testSymbol;
  };

  ReactTestComponent.test = test;
  var plugin = {
    serialize: serialize,
    test: test
  };
  var _default$2e = plugin;
  ReactTestComponent.default = _default$2e;

  Object.defineProperty(build, '__esModule', {
    value: true
  });
  var default_1 = build.default = DEFAULT_OPTIONS_1 = build.DEFAULT_OPTIONS = void 0;
  var format_1 = build.format = format;
  var plugins_1 = build.plugins = void 0;

  var _ansiStyles = _interopRequireDefault$7(ansiStyles.exports);

  var _collections = collections;

  var _AsymmetricMatcher = _interopRequireDefault$7(AsymmetricMatcher);

  var _ConvertAnsi = _interopRequireDefault$7(ConvertAnsi);

  var _DOMCollection = _interopRequireDefault$7(DOMCollection$1);

  var _DOMElement = _interopRequireDefault$7(DOMElement);

  var _Immutable = _interopRequireDefault$7(Immutable);

  var _ReactElement = _interopRequireDefault$7(ReactElement);

  var _ReactTestComponent = _interopRequireDefault$7(ReactTestComponent);

  function _interopRequireDefault$7(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  /**
   * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  /* eslint-disable local/ban-types-eventually */


  var toString = Object.prototype.toString;
  var toISOString = Date.prototype.toISOString;
  var errorToString = Error.prototype.toString;
  var regExpToString = RegExp.prototype.toString;
  /**
   * Explicitly comparing typeof constructor to function avoids undefined as name
   * when mock identity-obj-proxy returns the key as the value for any key.
   */

  var getConstructorName = function getConstructorName(val) {
    return typeof val.constructor === 'function' && val.constructor.name || 'Object';
  };
  /* global window */

  /** Is val is equal to global window object? Works even if it does not exist :) */


  var isWindow = function isWindow(val) {
    return typeof window !== 'undefined' && val === window;
  };

  var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
  var NEWLINE_REGEXP = /\n/gi;

  var PrettyFormatPluginError = /*#__PURE__*/function (_Error) {
    _inheritsLoose(PrettyFormatPluginError, _Error);

    function PrettyFormatPluginError(message, stack) {
      var _this;

      _this = _Error.call(this, message) || this;
      _this.stack = stack;
      _this.name = _this.constructor.name;
      return _this;
    }

    return PrettyFormatPluginError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  function isToStringedArrayType(toStringed) {
    return toStringed === '[object Array]' || toStringed === '[object ArrayBuffer]' || toStringed === '[object DataView]' || toStringed === '[object Float32Array]' || toStringed === '[object Float64Array]' || toStringed === '[object Int8Array]' || toStringed === '[object Int16Array]' || toStringed === '[object Int32Array]' || toStringed === '[object Uint8Array]' || toStringed === '[object Uint8ClampedArray]' || toStringed === '[object Uint16Array]' || toStringed === '[object Uint32Array]';
  }

  function printNumber(val) {
    return Object.is(val, -0) ? '-0' : String(val);
  }

  function printBigInt(val) {
    return String(val + "n");
  }

  function printFunction(val, printFunctionName) {
    if (!printFunctionName) {
      return '[Function]';
    }

    return '[Function ' + (val.name || 'anonymous') + ']';
  }

  function printSymbol(val) {
    return String(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
  }

  function printError(val) {
    return '[' + errorToString.call(val) + ']';
  }
  /**
   * The first port of call for printing an object, handles most of the
   * data-types in JS.
   */


  function printBasicValue(val, printFunctionName, escapeRegex, escapeString) {
    if (val === true || val === false) {
      return '' + val;
    }

    if (val === undefined) {
      return 'undefined';
    }

    if (val === null) {
      return 'null';
    }

    var typeOf = typeof val;

    if (typeOf === 'number') {
      return printNumber(val);
    }

    if (typeOf === 'bigint') {
      return printBigInt(val);
    }

    if (typeOf === 'string') {
      if (escapeString) {
        return '"' + val.replace(/"|\\/g, '\\$&') + '"';
      }

      return '"' + val + '"';
    }

    if (typeOf === 'function') {
      return printFunction(val, printFunctionName);
    }

    if (typeOf === 'symbol') {
      return printSymbol(val);
    }

    var toStringed = toString.call(val);

    if (toStringed === '[object WeakMap]') {
      return 'WeakMap {}';
    }

    if (toStringed === '[object WeakSet]') {
      return 'WeakSet {}';
    }

    if (toStringed === '[object Function]' || toStringed === '[object GeneratorFunction]') {
      return printFunction(val, printFunctionName);
    }

    if (toStringed === '[object Symbol]') {
      return printSymbol(val);
    }

    if (toStringed === '[object Date]') {
      return isNaN(+val) ? 'Date { NaN }' : toISOString.call(val);
    }

    if (toStringed === '[object Error]') {
      return printError(val);
    }

    if (toStringed === '[object RegExp]') {
      if (escapeRegex) {
        // https://github.com/benjamingr/RegExp.escape/blob/main/polyfill.js
        return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
      }

      return regExpToString.call(val);
    }

    if (val instanceof Error) {
      return printError(val);
    }

    return null;
  }
  /**
   * Handles more complex objects ( such as objects with circular references.
   * maps and sets etc )
   */


  function printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON) {
    if (refs.indexOf(val) !== -1) {
      return '[Circular]';
    }

    refs = refs.slice();
    refs.push(val);
    var hitMaxDepth = ++depth > config.maxDepth;
    var min = config.min;

    if (config.callToJSON && !hitMaxDepth && val.toJSON && typeof val.toJSON === 'function' && !hasCalledToJSON) {
      return printer(val.toJSON(), config, indentation, depth, refs, true);
    }

    var toStringed = toString.call(val);

    if (toStringed === '[object Arguments]') {
      return hitMaxDepth ? '[Arguments]' : (min ? '' : 'Arguments ') + '[' + (0, _collections.printListItems)(val, config, indentation, depth, refs, printer) + ']';
    }

    if (isToStringedArrayType(toStringed)) {
      return hitMaxDepth ? '[' + val.constructor.name + ']' : (min ? '' : !config.printBasicPrototype && val.constructor.name === 'Array' ? '' : val.constructor.name + ' ') + '[' + (0, _collections.printListItems)(val, config, indentation, depth, refs, printer) + ']';
    }

    if (toStringed === '[object Map]') {
      return hitMaxDepth ? '[Map]' : 'Map {' + (0, _collections.printIteratorEntries)(val.entries(), config, indentation, depth, refs, printer, ' => ') + '}';
    }

    if (toStringed === '[object Set]') {
      return hitMaxDepth ? '[Set]' : 'Set {' + (0, _collections.printIteratorValues)(val.values(), config, indentation, depth, refs, printer) + '}';
    } // Avoid failure to serialize global window object in jsdom test environment.
    // For example, not even relevant if window is prop of React element.


    return hitMaxDepth || isWindow(val) ? '[' + getConstructorName(val) + ']' : (min ? '' : !config.printBasicPrototype && getConstructorName(val) === 'Object' ? '' : getConstructorName(val) + ' ') + '{' + (0, _collections.printObjectProperties)(val, config, indentation, depth, refs, printer) + '}';
  }

  function isNewPlugin(plugin) {
    return plugin.serialize != null;
  }

  function printPlugin(plugin, val, config, indentation, depth, refs) {
    var printed;

    try {
      printed = isNewPlugin(plugin) ? plugin.serialize(val, config, indentation, depth, refs, printer) : plugin.print(val, function (valChild) {
        return printer(valChild, config, indentation, depth, refs);
      }, function (str) {
        var indentationNext = indentation + config.indent;
        return indentationNext + str.replace(NEWLINE_REGEXP, '\n' + indentationNext);
      }, {
        edgeSpacing: config.spacingOuter,
        min: config.min,
        spacing: config.spacingInner
      }, config.colors);
    } catch (error) {
      throw new PrettyFormatPluginError(error.message, error.stack);
    }

    if (typeof printed !== 'string') {
      throw new Error("pretty-format: Plugin must return type \"string\" but instead returned \"" + typeof printed + "\".");
    }

    return printed;
  }

  function findPlugin(plugins, val) {
    for (var p = 0; p < plugins.length; p++) {
      try {
        if (plugins[p].test(val)) {
          return plugins[p];
        }
      } catch (error) {
        throw new PrettyFormatPluginError(error.message, error.stack);
      }
    }

    return null;
  }

  function printer(val, config, indentation, depth, refs, hasCalledToJSON) {
    var plugin = findPlugin(config.plugins, val);

    if (plugin !== null) {
      return printPlugin(plugin, val, config, indentation, depth, refs);
    }

    var basicResult = printBasicValue(val, config.printFunctionName, config.escapeRegex, config.escapeString);

    if (basicResult !== null) {
      return basicResult;
    }

    return printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON);
  }

  var DEFAULT_THEME = {
    comment: 'gray',
    content: 'reset',
    prop: 'yellow',
    tag: 'cyan',
    value: 'green'
  };
  var DEFAULT_THEME_KEYS = Object.keys(DEFAULT_THEME);
  var DEFAULT_OPTIONS = {
    callToJSON: true,
    compareKeys: undefined,
    escapeRegex: false,
    escapeString: true,
    highlight: false,
    indent: 2,
    maxDepth: Infinity,
    min: false,
    plugins: [],
    printBasicPrototype: true,
    printFunctionName: true,
    theme: DEFAULT_THEME
  };
  var DEFAULT_OPTIONS_1 = build.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

  function validateOptions(options) {
    Object.keys(options).forEach(function (key) {
      if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
        throw new Error("pretty-format: Unknown option \"" + key + "\".");
      }
    });

    if (options.min && options.indent !== undefined && options.indent !== 0) {
      throw new Error('pretty-format: Options "min" and "indent" cannot be used together.');
    }

    if (options.theme !== undefined) {
      if (options.theme === null) {
        throw new Error('pretty-format: Option "theme" must not be null.');
      }

      if (typeof options.theme !== 'object') {
        throw new Error("pretty-format: Option \"theme\" must be of type \"object\" but instead received \"" + typeof options.theme + "\".");
      }
    }
  }

  var getColorsHighlight = function getColorsHighlight(options) {
    return DEFAULT_THEME_KEYS.reduce(function (colors, key) {
      var value = options.theme && options.theme[key] !== undefined ? options.theme[key] : DEFAULT_THEME[key];
      var color = value && _ansiStyles.default[value];

      if (color && typeof color.close === 'string' && typeof color.open === 'string') {
        colors[key] = color;
      } else {
        throw new Error("pretty-format: Option \"theme\" has a key \"" + key + "\" whose value \"" + value + "\" is undefined in ansi-styles.");
      }

      return colors;
    }, Object.create(null));
  };

  var getColorsEmpty = function getColorsEmpty() {
    return DEFAULT_THEME_KEYS.reduce(function (colors, key) {
      colors[key] = {
        close: '',
        open: ''
      };
      return colors;
    }, Object.create(null));
  };

  var getPrintFunctionName = function getPrintFunctionName(options) {
    return options && options.printFunctionName !== undefined ? options.printFunctionName : DEFAULT_OPTIONS.printFunctionName;
  };

  var getEscapeRegex = function getEscapeRegex(options) {
    return options && options.escapeRegex !== undefined ? options.escapeRegex : DEFAULT_OPTIONS.escapeRegex;
  };

  var getEscapeString = function getEscapeString(options) {
    return options && options.escapeString !== undefined ? options.escapeString : DEFAULT_OPTIONS.escapeString;
  };

  var getConfig$1 = function getConfig(options) {
    var _options$printBasicPr;

    return {
      callToJSON: options && options.callToJSON !== undefined ? options.callToJSON : DEFAULT_OPTIONS.callToJSON,
      colors: options && options.highlight ? getColorsHighlight(options) : getColorsEmpty(),
      compareKeys: options && typeof options.compareKeys === 'function' ? options.compareKeys : DEFAULT_OPTIONS.compareKeys,
      escapeRegex: getEscapeRegex(options),
      escapeString: getEscapeString(options),
      indent: options && options.min ? '' : createIndent(options && options.indent !== undefined ? options.indent : DEFAULT_OPTIONS.indent),
      maxDepth: options && options.maxDepth !== undefined ? options.maxDepth : DEFAULT_OPTIONS.maxDepth,
      min: options && options.min !== undefined ? options.min : DEFAULT_OPTIONS.min,
      plugins: options && options.plugins !== undefined ? options.plugins : DEFAULT_OPTIONS.plugins,
      printBasicPrototype: (_options$printBasicPr = options === null || options === void 0 ? void 0 : options.printBasicPrototype) !== null && _options$printBasicPr !== void 0 ? _options$printBasicPr : true,
      printFunctionName: getPrintFunctionName(options),
      spacingInner: options && options.min ? ' ' : '\n',
      spacingOuter: options && options.min ? '' : '\n'
    };
  };

  function createIndent(indent) {
    return new Array(indent + 1).join(' ');
  }
  /**
   * Returns a presentation string of your `val` object
   * @param val any potential JavaScript object
   * @param options Custom settings
   */


  function format(val, options) {
    if (options) {
      validateOptions(options);

      if (options.plugins) {
        var plugin = findPlugin(options.plugins, val);

        if (plugin !== null) {
          return printPlugin(plugin, val, getConfig$1(options), '', 0, []);
        }
      }
    }

    var basicResult = printBasicValue(val, getPrintFunctionName(options), getEscapeRegex(options), getEscapeString(options));

    if (basicResult !== null) {
      return basicResult;
    }

    return printComplexValue(val, getConfig$1(options), '', 0, []);
  }

  var plugins = {
    AsymmetricMatcher: _AsymmetricMatcher.default,
    ConvertAnsi: _ConvertAnsi.default,
    DOMCollection: _DOMCollection.default,
    DOMElement: _DOMElement.default,
    Immutable: _Immutable.default,
    ReactElement: _ReactElement.default,
    ReactTestComponent: _ReactTestComponent.default
  };
  plugins_1 = build.plugins = plugins;
  var _default$2d = format;
  default_1 = build.default = _default$2d;

  var index = /*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    get DEFAULT_OPTIONS () { return DEFAULT_OPTIONS_1; },
    format: format_1,
    get plugins () { return plugins_1; },
    get default () { return default_1; }
  }, [build]);

  /**
   * @source {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill}
   * but without thisArg (too hard to type, no need to `this`)
   */
  var toStr = Object.prototype.toString;

  function isCallable(fn) {
    return typeof fn === "function" || toStr.call(fn) === "[object Function]";
  }

  function toInteger(value) {
    var number = Number(value);

    if (isNaN(number)) {
      return 0;
    }

    if (number === 0 || !isFinite(number)) {
      return number;
    }

    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  }

  var maxSafeInteger = Math.pow(2, 53) - 1;

  function toLength(value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  }
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   */

  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */


  function arrayFrom(arrayLike, mapFn) {
    // 1. Let C be the this value.
    // edit(@eps1lon): we're not calling it as Array.from
    var C = Array; // 2. Let items be ToObject(arrayLike).

    var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

    if (arrayLike == null) {
      throw new TypeError("Array.from requires an array-like object - not null or undefined");
    } // 4. If mapfn is undefined, then let mapping be false.
    // const mapFn = arguments.length > 1 ? arguments[1] : void undefined;


    if (typeof mapFn !== "undefined") {
      // 5. else
      // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError("Array.from: when provided, the second argument must be a function");
      }
    } // 10. Let lenValue be Get(items, "length").
    // 11. Let len be ToLength(lenValue).


    var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
    // 13. a. Let A be the result of calling the [[Construct]] internal method
    // of C with an argument list containing the single item len.
    // 14. a. Else, Let A be ArrayCreate(len).

    var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

    var k = 0; // 17. Repeat, while k < len… (also steps a - h)

    var kValue;

    while (k < len) {
      kValue = items[k];

      if (mapFn) {
        A[k] = mapFn(kValue, k);
      } else {
        A[k] = kValue;
      }

      k += 1;
    } // 18. Let putStatus be Put(A, "length", len, true).


    A.length = len; // 20. Return A.

    return A;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  } // for environments without Set we fallback to arrays with unique members


  var SetLike = /*#__PURE__*/function () {
    function SetLike() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _classCallCheck(this, SetLike);

      _defineProperty$1(this, "items", void 0);

      this.items = items;
    }

    _createClass(SetLike, [{
      key: "add",
      value: function add(value) {
        if (this.has(value) === false) {
          this.items.push(value);
        }

        return this;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.items = [];
      }
    }, {
      key: "delete",
      value: function _delete(value) {
        var previousLength = this.items.length;
        this.items = this.items.filter(function (item) {
          return item !== value;
        });
        return previousLength !== this.items.length;
      }
    }, {
      key: "forEach",
      value: function forEach(callbackfn) {
        var _this = this;

        this.items.forEach(function (item) {
          callbackfn(item, item, _this);
        });
      }
    }, {
      key: "has",
      value: function has(value) {
        return this.items.indexOf(value) !== -1;
      }
    }, {
      key: "size",
      get: function get() {
        return this.items.length;
      }
    }]);

    return SetLike;
  }();

  var SetLike$1 = typeof Set === "undefined" ? Set : SetLike;

  // https://w3c.github.io/html-aria/#document-conformance-requirements-for-use-of-aria-attributes-in-html

  /**
   * Safe Element.localName for all supported environments
   * @param element
   */
  function getLocalName(element) {
    var _element$localName;

    return (// eslint-disable-next-line no-restricted-properties -- actual guard for environments without localName
      (_element$localName = element.localName) !== null && _element$localName !== void 0 ? _element$localName : // eslint-disable-next-line no-restricted-properties -- required for the fallback
      element.tagName.toLowerCase()
    );
  }
  var localNameToRoleMappings = {
    article: "article",
    aside: "complementary",
    button: "button",
    datalist: "listbox",
    dd: "definition",
    details: "group",
    dialog: "dialog",
    dt: "term",
    fieldset: "group",
    figure: "figure",
    // WARNING: Only with an accessible name
    form: "form",
    footer: "contentinfo",
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
    header: "banner",
    hr: "separator",
    html: "document",
    legend: "legend",
    li: "listitem",
    math: "math",
    main: "main",
    menu: "list",
    nav: "navigation",
    ol: "list",
    optgroup: "group",
    // WARNING: Only in certain context
    option: "option",
    output: "status",
    progress: "progressbar",
    // WARNING: Only with an accessible name
    section: "region",
    summary: "button",
    table: "table",
    tbody: "rowgroup",
    textarea: "textbox",
    tfoot: "rowgroup",
    // WARNING: Only in certain context
    td: "cell",
    th: "columnheader",
    thead: "rowgroup",
    tr: "row",
    ul: "list"
  };
  var prohibitedAttributes = {
    caption: new Set(["aria-label", "aria-labelledby"]),
    code: new Set(["aria-label", "aria-labelledby"]),
    deletion: new Set(["aria-label", "aria-labelledby"]),
    emphasis: new Set(["aria-label", "aria-labelledby"]),
    generic: new Set(["aria-label", "aria-labelledby", "aria-roledescription"]),
    insertion: new Set(["aria-label", "aria-labelledby"]),
    paragraph: new Set(["aria-label", "aria-labelledby"]),
    presentation: new Set(["aria-label", "aria-labelledby"]),
    strong: new Set(["aria-label", "aria-labelledby"]),
    subscript: new Set(["aria-label", "aria-labelledby"]),
    superscript: new Set(["aria-label", "aria-labelledby"])
  };
  /**
   *
   * @param element
   * @param role The role used for this element. This is specified to control whether you want to use the implicit or explicit role.
   */

  function hasGlobalAriaAttributes(element, role) {
    // https://rawgit.com/w3c/aria/stable/#global_states
    // commented attributes are deprecated
    return ["aria-atomic", "aria-busy", "aria-controls", "aria-current", "aria-describedby", "aria-details", // "disabled",
    "aria-dropeffect", // "errormessage",
    "aria-flowto", "aria-grabbed", // "haspopup",
    "aria-hidden", // "invalid",
    "aria-keyshortcuts", "aria-label", "aria-labelledby", "aria-live", "aria-owns", "aria-relevant", "aria-roledescription"].some(function (attributeName) {
      var _prohibitedAttributes;

      return element.hasAttribute(attributeName) && !((_prohibitedAttributes = prohibitedAttributes[role]) !== null && _prohibitedAttributes !== void 0 && _prohibitedAttributes.has(attributeName));
    });
  }

  function ignorePresentationalRole(element, implicitRole) {
    // https://rawgit.com/w3c/aria/stable/#conflict_resolution_presentation_none
    return hasGlobalAriaAttributes(element, implicitRole);
  }

  function getRole(element) {
    var explicitRole = getExplicitRole(element);

    if (explicitRole === null || explicitRole === "presentation") {
      var implicitRole = getImplicitRole(element);

      if (explicitRole !== "presentation" || ignorePresentationalRole(element, implicitRole || "")) {
        return implicitRole;
      }
    }

    return explicitRole;
  }

  function getImplicitRole(element) {
    var mappedByTag = localNameToRoleMappings[getLocalName(element)];

    if (mappedByTag !== undefined) {
      return mappedByTag;
    }

    switch (getLocalName(element)) {
      case "a":
      case "area":
      case "link":
        if (element.hasAttribute("href")) {
          return "link";
        }

        break;

      case "img":
        if (element.getAttribute("alt") === "" && !ignorePresentationalRole(element, "img")) {
          return "presentation";
        }

        return "img";

      case "input":
        {
          var _ref = element,
              type = _ref.type;

          switch (type) {
            case "button":
            case "image":
            case "reset":
            case "submit":
              return "button";

            case "checkbox":
            case "radio":
              return type;

            case "range":
              return "slider";

            case "email":
            case "tel":
            case "text":
            case "url":
              if (element.hasAttribute("list")) {
                return "combobox";
              }

              return "textbox";

            case "search":
              if (element.hasAttribute("list")) {
                return "combobox";
              }

              return "searchbox";

            case "number":
              return "spinbutton";

            default:
              return null;
          }
        }

      case "select":
        if (element.hasAttribute("multiple") || element.size > 1) {
          return "listbox";
        }

        return "combobox";
    }

    return null;
  }

  function getExplicitRole(element) {
    var role = element.getAttribute("role");

    if (role !== null) {
      var explicitRole = role.trim().split(" ")[0]; // String.prototype.split(sep, limit) will always return an array with at least one member
      // as long as limit is either undefined or > 0

      if (explicitRole.length > 0) {
        return explicitRole;
      }
    }

    return null;
  }

  function isElement(node) {
    return node !== null && node.nodeType === node.ELEMENT_NODE;
  }
  function isHTMLTableCaptionElement(node) {
    return isElement(node) && getLocalName(node) === "caption";
  }
  function isHTMLInputElement(node) {
    return isElement(node) && getLocalName(node) === "input";
  }
  function isHTMLOptGroupElement(node) {
    return isElement(node) && getLocalName(node) === "optgroup";
  }
  function isHTMLSelectElement(node) {
    return isElement(node) && getLocalName(node) === "select";
  }
  function isHTMLTableElement(node) {
    return isElement(node) && getLocalName(node) === "table";
  }
  function isHTMLTextAreaElement(node) {
    return isElement(node) && getLocalName(node) === "textarea";
  }
  function safeWindow(node) {
    var _ref = node.ownerDocument === null ? node : node.ownerDocument,
        defaultView = _ref.defaultView;

    if (defaultView === null) {
      throw new TypeError("no window available");
    }

    return defaultView;
  }
  function isHTMLFieldSetElement(node) {
    return isElement(node) && getLocalName(node) === "fieldset";
  }
  function isHTMLLegendElement(node) {
    return isElement(node) && getLocalName(node) === "legend";
  }
  function isHTMLSlotElement(node) {
    return isElement(node) && getLocalName(node) === "slot";
  }
  function isSVGElement(node) {
    return isElement(node) && node.ownerSVGElement !== undefined;
  }
  function isSVGSVGElement(node) {
    return isElement(node) && getLocalName(node) === "svg";
  }
  function isSVGTitleElement(node) {
    return isSVGElement(node) && getLocalName(node) === "title";
  }
  /**
   *
   * @param {Node} node -
   * @param {string} attributeName -
   * @returns {Element[]} -
   */

  function queryIdRefs(node, attributeName) {
    if (isElement(node) && node.hasAttribute(attributeName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute check
      var ids = node.getAttribute(attributeName).split(" ");
      return ids.map(function (id) {
        return node.ownerDocument.getElementById(id);
      }).filter(function (element) {
        return element !== null;
      } // TODO: why does this not narrow?
      );
    }

    return [];
  }
  function hasAnyConcreteRoles(node, roles) {
    if (isElement(node)) {
      return roles.indexOf(getRole(node)) !== -1;
    }

    return false;
  }

  /**
   * implements https://w3c.github.io/accname/
   */
  /**
   *  A string of characters where all carriage returns, newlines, tabs, and form-feeds are replaced with a single space, and multiple spaces are reduced to a single space. The string contains only character data; it does not contain any markup.
   */

  /**
   *
   * @param {string} string -
   * @returns {FlatString} -
   */

  function asFlatString(s) {
    return s.trim().replace(/\s\s+/g, " ");
  }
  /**
   *
   * @param node -
   * @param options - These are not optional to prevent accidentally calling it without options in `computeAccessibleName`
   * @returns {boolean} -
   */


  function isHidden(node, getComputedStyleImplementation) {
    if (!isElement(node)) {
      return false;
    }

    if (node.hasAttribute("hidden") || node.getAttribute("aria-hidden") === "true") {
      return true;
    }

    var style = getComputedStyleImplementation(node);
    return style.getPropertyValue("display") === "none" || style.getPropertyValue("visibility") === "hidden";
  }
  /**
   * @param {Node} node -
   * @returns {boolean} - As defined in step 2E of https://w3c.github.io/accname/#mapping_additional_nd_te
   */


  function isControl(node) {
    return hasAnyConcreteRoles(node, ["button", "combobox", "listbox", "textbox"]) || hasAbstractRole(node, "range");
  }

  function hasAbstractRole(node, role) {
    if (!isElement(node)) {
      return false;
    }

    switch (role) {
      case "range":
        return hasAnyConcreteRoles(node, ["meter", "progressbar", "scrollbar", "slider", "spinbutton"]);

      default:
        throw new TypeError("No knowledge about abstract role '".concat(role, "'. This is likely a bug :("));
    }
  }
  /**
   * element.querySelectorAll but also considers owned tree
   * @param element
   * @param selectors
   */


  function querySelectorAllSubtree(element, selectors) {
    var elements = arrayFrom(element.querySelectorAll(selectors));
    queryIdRefs(element, "aria-owns").forEach(function (root) {
      // babel transpiles this assuming an iterator
      elements.push.apply(elements, arrayFrom(root.querySelectorAll(selectors)));
    });
    return elements;
  }

  function querySelectedOptions(listbox) {
    if (isHTMLSelectElement(listbox)) {
      // IE11 polyfill
      return listbox.selectedOptions || querySelectorAllSubtree(listbox, "[selected]");
    }

    return querySelectorAllSubtree(listbox, '[aria-selected="true"]');
  }

  function isMarkedPresentational(node) {
    return hasAnyConcreteRoles(node, ["none", "presentation"]);
  }
  /**
   * Elements specifically listed in html-aam
   *
   * We don't need this for `label` or `legend` elements.
   * Their implicit roles already allow "naming from content".
   *
   * sources:
   *
   * - https://w3c.github.io/html-aam/#table-element
   */


  function isNativeHostLanguageTextAlternativeElement(node) {
    return isHTMLTableCaptionElement(node);
  }
  /**
   * https://w3c.github.io/aria/#namefromcontent
   */


  function allowsNameFromContent(node) {
    return hasAnyConcreteRoles(node, ["button", "cell", "checkbox", "columnheader", "gridcell", "heading", "label", "legend", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "rowheader", "switch", "tab", "tooltip", "treeitem"]);
  }
  /**
   * TODO https://github.com/eps1lon/dom-accessibility-api/issues/100
   */


  function isDescendantOfNativeHostLanguageTextAlternativeElement( // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not implemented yet
  node) {
    return false;
  }

  function getValueOfTextbox(element) {
    if (isHTMLInputElement(element) || isHTMLTextAreaElement(element)) {
      return element.value;
    } // https://github.com/eps1lon/dom-accessibility-api/issues/4


    return element.textContent || "";
  }

  function getTextualContent(declaration) {
    var content = declaration.getPropertyValue("content");

    if (/^["'].*["']$/.test(content)) {
      return content.slice(1, -1);
    }

    return "";
  }
  /**
   * https://html.spec.whatwg.org/multipage/forms.html#category-label
   * TODO: form-associated custom elements
   * @param element
   */


  function isLabelableElement(element) {
    var localName = getLocalName(element);
    return localName === "button" || localName === "input" && element.getAttribute("type") !== "hidden" || localName === "meter" || localName === "output" || localName === "progress" || localName === "select" || localName === "textarea";
  }
  /**
   * > [...], then the first such descendant in tree order is the label element's labeled control.
   * -- https://html.spec.whatwg.org/multipage/forms.html#labeled-control
   * @param element
   */


  function findLabelableElement(element) {
    if (isLabelableElement(element)) {
      return element;
    }

    var labelableElement = null;
    element.childNodes.forEach(function (childNode) {
      if (labelableElement === null && isElement(childNode)) {
        var descendantLabelableElement = findLabelableElement(childNode);

        if (descendantLabelableElement !== null) {
          labelableElement = descendantLabelableElement;
        }
      }
    });
    return labelableElement;
  }
  /**
   * Polyfill of HTMLLabelElement.control
   * https://html.spec.whatwg.org/multipage/forms.html#labeled-control
   * @param label
   */


  function getControlOfLabel(label) {
    if (label.control !== undefined) {
      return label.control;
    }

    var htmlFor = label.getAttribute("for");

    if (htmlFor !== null) {
      return label.ownerDocument.getElementById(htmlFor);
    }

    return findLabelableElement(label);
  }
  /**
   * Polyfill of HTMLInputElement.labels
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/labels
   * @param element
   */


  function getLabels$1(element) {
    var labelsProperty = element.labels;

    if (labelsProperty === null) {
      return labelsProperty;
    }

    if (labelsProperty !== undefined) {
      return arrayFrom(labelsProperty);
    } // polyfill


    if (!isLabelableElement(element)) {
      return null;
    }

    var document = element.ownerDocument;
    return arrayFrom(document.querySelectorAll("label")).filter(function (label) {
      return getControlOfLabel(label) === element;
    });
  }
  /**
   * Gets the contents of a slot used for computing the accname
   * @param slot
   */


  function getSlotContents(slot) {
    // Computing the accessible name for elements containing slots is not
    // currently defined in the spec. This implementation reflects the
    // behavior of NVDA 2020.2/Firefox 81 and iOS VoiceOver/Safari 13.6.
    var assignedNodes = slot.assignedNodes();

    if (assignedNodes.length === 0) {
      // if no nodes are assigned to the slot, it displays the default content
      return arrayFrom(slot.childNodes);
    }

    return assignedNodes;
  }
  /**
   * implements https://w3c.github.io/accname/#mapping_additional_nd_te
   * @param root
   * @param options
   * @returns
   */


  function computeTextAlternative(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var consultedNodes = new SetLike$1();
    var window = safeWindow(root);
    var _options$compute = options.compute,
        compute = _options$compute === void 0 ? "name" : _options$compute,
        _options$computedStyl = options.computedStyleSupportsPseudoElements,
        computedStyleSupportsPseudoElements = _options$computedStyl === void 0 ? options.getComputedStyle !== undefined : _options$computedStyl,
        _options$getComputedS = options.getComputedStyle,
        getComputedStyle = _options$getComputedS === void 0 ? window.getComputedStyle.bind(window) : _options$getComputedS,
        _options$hidden = options.hidden,
        hidden = _options$hidden === void 0 ? false : _options$hidden; // 2F.i

    function computeMiscTextAlternative(node, context) {
      var accumulatedText = "";

      if (isElement(node) && computedStyleSupportsPseudoElements) {
        var pseudoBefore = getComputedStyle(node, "::before");
        var beforeContent = getTextualContent(pseudoBefore);
        accumulatedText = "".concat(beforeContent, " ").concat(accumulatedText);
      } // FIXME: Including aria-owns is not defined in the spec
      // But it is required in the web-platform-test


      var childNodes = isHTMLSlotElement(node) ? getSlotContents(node) : arrayFrom(node.childNodes).concat(queryIdRefs(node, "aria-owns"));
      childNodes.forEach(function (child) {
        var result = computeTextAlternative(child, {
          isEmbeddedInLabel: context.isEmbeddedInLabel,
          isReferenced: false,
          recursion: true
        }); // TODO: Unclear why display affects delimiter
        // see https://github.com/w3c/accname/issues/3

        var display = isElement(child) ? getComputedStyle(child).getPropertyValue("display") : "inline";
        var separator = display !== "inline" ? " " : ""; // trailing separator for wpt tests

        accumulatedText += "".concat(separator).concat(result).concat(separator);
      });

      if (isElement(node) && computedStyleSupportsPseudoElements) {
        var pseudoAfter = getComputedStyle(node, "::after");
        var afterContent = getTextualContent(pseudoAfter);
        accumulatedText = "".concat(accumulatedText, " ").concat(afterContent);
      }

      return accumulatedText.trim();
    }

    function computeElementTextAlternative(node) {
      if (!isElement(node)) {
        return null;
      }
      /**
       *
       * @param element
       * @param attributeName
       * @returns A string non-empty string or `null`
       */


      function useAttribute(element, attributeName) {
        var attribute = element.getAttributeNode(attributeName);

        if (attribute !== null && !consultedNodes.has(attribute) && attribute.value.trim() !== "") {
          consultedNodes.add(attribute);
          return attribute.value;
        }

        return null;
      } // https://w3c.github.io/html-aam/#fieldset-and-legend-elements


      if (isHTMLFieldSetElement(node)) {
        consultedNodes.add(node);
        var children = arrayFrom(node.childNodes);

        for (var i = 0; i < children.length; i += 1) {
          var child = children[i];

          if (isHTMLLegendElement(child)) {
            return computeTextAlternative(child, {
              isEmbeddedInLabel: false,
              isReferenced: false,
              recursion: false
            });
          }
        }
      } else if (isHTMLTableElement(node)) {
        // https://w3c.github.io/html-aam/#table-element
        consultedNodes.add(node);

        var _children = arrayFrom(node.childNodes);

        for (var _i = 0; _i < _children.length; _i += 1) {
          var _child = _children[_i];

          if (isHTMLTableCaptionElement(_child)) {
            return computeTextAlternative(_child, {
              isEmbeddedInLabel: false,
              isReferenced: false,
              recursion: false
            });
          }
        }
      } else if (isSVGSVGElement(node)) {
        // https://www.w3.org/TR/svg-aam-1.0/
        consultedNodes.add(node);

        var _children2 = arrayFrom(node.childNodes);

        for (var _i2 = 0; _i2 < _children2.length; _i2 += 1) {
          var _child2 = _children2[_i2];

          if (isSVGTitleElement(_child2)) {
            return _child2.textContent;
          }
        }

        return null;
      } else if (getLocalName(node) === "img" || getLocalName(node) === "area") {
        // https://w3c.github.io/html-aam/#area-element
        // https://w3c.github.io/html-aam/#img-element
        var nameFromAlt = useAttribute(node, "alt");

        if (nameFromAlt !== null) {
          return nameFromAlt;
        }
      } else if (isHTMLOptGroupElement(node)) {
        var nameFromLabel = useAttribute(node, "label");

        if (nameFromLabel !== null) {
          return nameFromLabel;
        }
      }

      if (isHTMLInputElement(node) && (node.type === "button" || node.type === "submit" || node.type === "reset")) {
        // https://w3c.github.io/html-aam/#input-type-text-input-type-password-input-type-search-input-type-tel-input-type-email-input-type-url-and-textarea-element-accessible-description-computation
        var nameFromValue = useAttribute(node, "value");

        if (nameFromValue !== null) {
          return nameFromValue;
        } // TODO: l10n


        if (node.type === "submit") {
          return "Submit";
        } // TODO: l10n


        if (node.type === "reset") {
          return "Reset";
        }
      }

      var labels = getLabels$1(node);

      if (labels !== null && labels.length !== 0) {
        consultedNodes.add(node);
        return arrayFrom(labels).map(function (element) {
          return computeTextAlternative(element, {
            isEmbeddedInLabel: true,
            isReferenced: false,
            recursion: true
          });
        }).filter(function (label) {
          return label.length > 0;
        }).join(" ");
      } // https://w3c.github.io/html-aam/#input-type-image-accessible-name-computation
      // TODO: wpt test consider label elements but html-aam does not mention them
      // We follow existing implementations over spec


      if (isHTMLInputElement(node) && node.type === "image") {
        var _nameFromAlt = useAttribute(node, "alt");

        if (_nameFromAlt !== null) {
          return _nameFromAlt;
        }

        var nameFromTitle = useAttribute(node, "title");

        if (nameFromTitle !== null) {
          return nameFromTitle;
        } // TODO: l10n


        return "Submit Query";
      }

      if (hasAnyConcreteRoles(node, ["button"])) {
        // https://www.w3.org/TR/html-aam-1.0/#button-element
        var nameFromSubTree = computeMiscTextAlternative(node, {
          isEmbeddedInLabel: false,
          isReferenced: false
        });

        if (nameFromSubTree !== "") {
          return nameFromSubTree;
        }

        return useAttribute(node, "title");
      }

      return useAttribute(node, "title");
    }

    function computeTextAlternative(current, context) {
      if (consultedNodes.has(current)) {
        return "";
      } // 2A


      if (!hidden && isHidden(current, getComputedStyle) && !context.isReferenced) {
        consultedNodes.add(current);
        return "";
      } // 2B


      var labelElements = queryIdRefs(current, "aria-labelledby");

      if (compute === "name" && !context.isReferenced && labelElements.length > 0) {
        return labelElements.map(function (element) {
          return computeTextAlternative(element, {
            isEmbeddedInLabel: context.isEmbeddedInLabel,
            isReferenced: true,
            // thais isn't recursion as specified, otherwise we would skip
            // `aria-label` in
            // <input id="myself" aria-label="foo" aria-labelledby="myself"
            recursion: false
          });
        }).join(" ");
      } // 2C
      // Changed from the spec in anticipation of https://github.com/w3c/accname/issues/64
      // spec says we should only consider skipping if we have a non-empty label


      var skipToStep2E = context.recursion && isControl(current) && compute === "name";

      if (!skipToStep2E) {
        var ariaLabel = (isElement(current) && current.getAttribute("aria-label") || "").trim();

        if (ariaLabel !== "" && compute === "name") {
          consultedNodes.add(current);
          return ariaLabel;
        } // 2D


        if (!isMarkedPresentational(current)) {
          var elementTextAlternative = computeElementTextAlternative(current);

          if (elementTextAlternative !== null) {
            consultedNodes.add(current);
            return elementTextAlternative;
          }
        }
      } // special casing, cheating to make tests pass
      // https://github.com/w3c/accname/issues/67


      if (hasAnyConcreteRoles(current, ["menu"])) {
        consultedNodes.add(current);
        return "";
      } // 2E


      if (skipToStep2E || context.isEmbeddedInLabel || context.isReferenced) {
        if (hasAnyConcreteRoles(current, ["combobox", "listbox"])) {
          consultedNodes.add(current);
          var selectedOptions = querySelectedOptions(current);

          if (selectedOptions.length === 0) {
            // defined per test `name_heading_combobox`
            return isHTMLInputElement(current) ? current.value : "";
          }

          return arrayFrom(selectedOptions).map(function (selectedOption) {
            return computeTextAlternative(selectedOption, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false,
              recursion: true
            });
          }).join(" ");
        }

        if (hasAbstractRole(current, "range")) {
          consultedNodes.add(current);

          if (current.hasAttribute("aria-valuetext")) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute guard
            return current.getAttribute("aria-valuetext");
          }

          if (current.hasAttribute("aria-valuenow")) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe due to hasAttribute guard
            return current.getAttribute("aria-valuenow");
          } // Otherwise, use the value as specified by a host language attribute.


          return current.getAttribute("value") || "";
        }

        if (hasAnyConcreteRoles(current, ["textbox"])) {
          consultedNodes.add(current);
          return getValueOfTextbox(current);
        }
      } // 2F: https://w3c.github.io/accname/#step2F


      if (allowsNameFromContent(current) || isElement(current) && context.isReferenced || isNativeHostLanguageTextAlternativeElement(current) || isDescendantOfNativeHostLanguageTextAlternativeElement()) {
        consultedNodes.add(current);
        return computeMiscTextAlternative(current, {
          isEmbeddedInLabel: context.isEmbeddedInLabel,
          isReferenced: false
        });
      }

      if (current.nodeType === current.TEXT_NODE) {
        consultedNodes.add(current);
        return current.textContent || "";
      }

      if (context.recursion) {
        consultedNodes.add(current);
        return computeMiscTextAlternative(current, {
          isEmbeddedInLabel: context.isEmbeddedInLabel,
          isReferenced: false
        });
      }


      consultedNodes.add(current);
      return "";
    }

    return asFlatString(computeTextAlternative(root, {
      isEmbeddedInLabel: false,
      // by spec computeAccessibleDescription starts with the referenced elements as roots
      isReferenced: compute === "description",
      recursion: false
    }));
  }

  /**
   * https://w3c.github.io/aria/#namefromprohibited
   */

  function prohibitsNaming(node) {
    return hasAnyConcreteRoles(node, ["caption", "code", "deletion", "emphasis", "generic", "insertion", "paragraph", "presentation", "strong", "subscript", "superscript"]);
  }
  /**
   * implements https://w3c.github.io/accname/#mapping_additional_nd_name
   * @param root
   * @param options
   * @returns
   */


  function computeAccessibleName(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (prohibitsNaming(root)) {
      return "";
    }

    return computeTextAlternative(root, options);
  }

  var lib = {};

  var ariaPropsMap$1 = {};

  Object.defineProperty(ariaPropsMap$1, "__esModule", {
    value: true
  });
  ariaPropsMap$1.default = void 0;

  function _slicedToArray$4(arr, i) {
    return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$5(arr, i) || _nonIterableRest$4();
  }

  function _nonIterableRest$4() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray$5(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$5(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen);
  }

  function _arrayLikeToArray$5(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _iterableToArrayLimit$4(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$4(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var properties = [['aria-activedescendant', {
    'type': 'id'
  }], ['aria-atomic', {
    'type': 'boolean'
  }], ['aria-autocomplete', {
    'type': 'token',
    'values': ['inline', 'list', 'both', 'none']
  }], ['aria-busy', {
    'type': 'boolean'
  }], ['aria-checked', {
    'type': 'tristate'
  }], ['aria-colcount', {
    type: 'integer'
  }], ['aria-colindex', {
    type: 'integer'
  }], ['aria-colspan', {
    type: 'integer'
  }], ['aria-controls', {
    'type': 'idlist'
  }], ['aria-current', {
    type: 'token',
    values: ['page', 'step', 'location', 'date', 'time', true, false]
  }], ['aria-describedby', {
    'type': 'idlist'
  }], ['aria-details', {
    'type': 'id'
  }], ['aria-disabled', {
    'type': 'boolean'
  }], ['aria-dropeffect', {
    'type': 'tokenlist',
    'values': ['copy', 'execute', 'link', 'move', 'none', 'popup']
  }], ['aria-errormessage', {
    'type': 'id'
  }], ['aria-expanded', {
    'type': 'boolean',
    'allowundefined': true
  }], ['aria-flowto', {
    'type': 'idlist'
  }], ['aria-grabbed', {
    'type': 'boolean',
    'allowundefined': true
  }], ['aria-haspopup', {
    'type': 'token',
    'values': [false, true, 'menu', 'listbox', 'tree', 'grid', 'dialog']
  }], ['aria-hidden', {
    'type': 'boolean',
    'allowundefined': true
  }], ['aria-invalid', {
    'type': 'token',
    'values': ['grammar', false, 'spelling', true]
  }], ['aria-keyshortcuts', {
    type: 'string'
  }], ['aria-label', {
    'type': 'string'
  }], ['aria-labelledby', {
    'type': 'idlist'
  }], ['aria-level', {
    'type': 'integer'
  }], ['aria-live', {
    'type': 'token',
    'values': ['assertive', 'off', 'polite']
  }], ['aria-modal', {
    type: 'boolean'
  }], ['aria-multiline', {
    'type': 'boolean'
  }], ['aria-multiselectable', {
    'type': 'boolean'
  }], ['aria-orientation', {
    'type': 'token',
    'values': ['vertical', 'undefined', 'horizontal']
  }], ['aria-owns', {
    'type': 'idlist'
  }], ['aria-placeholder', {
    type: 'string'
  }], ['aria-posinset', {
    'type': 'integer'
  }], ['aria-pressed', {
    'type': 'tristate'
  }], ['aria-readonly', {
    'type': 'boolean'
  }], ['aria-relevant', {
    'type': 'tokenlist',
    'values': ['additions', 'all', 'removals', 'text']
  }], ['aria-required', {
    'type': 'boolean'
  }], ['aria-roledescription', {
    type: 'string'
  }], ['aria-rowcount', {
    type: 'integer'
  }], ['aria-rowindex', {
    type: 'integer'
  }], ['aria-rowspan', {
    type: 'integer'
  }], ['aria-selected', {
    'type': 'boolean',
    'allowundefined': true
  }], ['aria-setsize', {
    'type': 'integer'
  }], ['aria-sort', {
    'type': 'token',
    'values': ['ascending', 'descending', 'none', 'other']
  }], ['aria-valuemax', {
    'type': 'number'
  }], ['aria-valuemin', {
    'type': 'number'
  }], ['aria-valuenow', {
    'type': 'number'
  }], ['aria-valuetext', {
    'type': 'string'
  }]];
  var ariaPropsMap = {
    entries: function entries() {
      return properties;
    },
    get: function get(key) {
      var item = properties.find(function (tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return properties.map(function (_ref) {
        var _ref2 = _slicedToArray$4(_ref, 1),
            key = _ref2[0];

        return key;
      });
    },
    values: function values() {
      return properties.map(function (_ref3) {
        var _ref4 = _slicedToArray$4(_ref3, 2),
            values = _ref4[1];

        return values;
      });
    }
  };
  var _default$2c = ariaPropsMap;
  ariaPropsMap$1.default = _default$2c;

  var domMap$1 = {};

  Object.defineProperty(domMap$1, "__esModule", {
    value: true
  });
  domMap$1.default = void 0;

  function _slicedToArray$3(arr, i) {
    return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$4(arr, i) || _nonIterableRest$3();
  }

  function _nonIterableRest$3() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray$4(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$4(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen);
  }

  function _arrayLikeToArray$4(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _iterableToArrayLimit$3(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$3(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var dom$1 = [['a', {
    reserved: false
  }], ['abbr', {
    reserved: false
  }], ['acronym', {
    reserved: false
  }], ['address', {
    reserved: false
  }], ['applet', {
    reserved: false
  }], ['area', {
    reserved: false
  }], ['article', {
    reserved: false
  }], ['aside', {
    reserved: false
  }], ['audio', {
    reserved: false
  }], ['b', {
    reserved: false
  }], ['base', {
    reserved: true
  }], ['bdi', {
    reserved: false
  }], ['bdo', {
    reserved: false
  }], ['big', {
    reserved: false
  }], ['blink', {
    reserved: false
  }], ['blockquote', {
    reserved: false
  }], ['body', {
    reserved: false
  }], ['br', {
    reserved: false
  }], ['button', {
    reserved: false
  }], ['canvas', {
    reserved: false
  }], ['caption', {
    reserved: false
  }], ['center', {
    reserved: false
  }], ['cite', {
    reserved: false
  }], ['code', {
    reserved: false
  }], ['col', {
    reserved: true
  }], ['colgroup', {
    reserved: true
  }], ['content', {
    reserved: false
  }], ['data', {
    reserved: false
  }], ['datalist', {
    reserved: false
  }], ['dd', {
    reserved: false
  }], ['del', {
    reserved: false
  }], ['details', {
    reserved: false
  }], ['dfn', {
    reserved: false
  }], ['dialog', {
    reserved: false
  }], ['dir', {
    reserved: false
  }], ['div', {
    reserved: false
  }], ['dl', {
    reserved: false
  }], ['dt', {
    reserved: false
  }], ['em', {
    reserved: false
  }], ['embed', {
    reserved: false
  }], ['fieldset', {
    reserved: false
  }], ['figcaption', {
    reserved: false
  }], ['figure', {
    reserved: false
  }], ['font', {
    reserved: false
  }], ['footer', {
    reserved: false
  }], ['form', {
    reserved: false
  }], ['frame', {
    reserved: false
  }], ['frameset', {
    reserved: false
  }], ['h1', {
    reserved: false
  }], ['h2', {
    reserved: false
  }], ['h3', {
    reserved: false
  }], ['h4', {
    reserved: false
  }], ['h5', {
    reserved: false
  }], ['h6', {
    reserved: false
  }], ['head', {
    reserved: true
  }], ['header', {
    reserved: false
  }], ['hgroup', {
    reserved: false
  }], ['hr', {
    reserved: false
  }], ['html', {
    reserved: true
  }], ['i', {
    reserved: false
  }], ['iframe', {
    reserved: false
  }], ['img', {
    reserved: false
  }], ['input', {
    reserved: false
  }], ['ins', {
    reserved: false
  }], ['kbd', {
    reserved: false
  }], ['keygen', {
    reserved: false
  }], ['label', {
    reserved: false
  }], ['legend', {
    reserved: false
  }], ['li', {
    reserved: false
  }], ['link', {
    reserved: true
  }], ['main', {
    reserved: false
  }], ['map', {
    reserved: false
  }], ['mark', {
    reserved: false
  }], ['marquee', {
    reserved: false
  }], ['menu', {
    reserved: false
  }], ['menuitem', {
    reserved: false
  }], ['meta', {
    reserved: true
  }], ['meter', {
    reserved: false
  }], ['nav', {
    reserved: false
  }], ['noembed', {
    reserved: true
  }], ['noscript', {
    reserved: true
  }], ['object', {
    reserved: false
  }], ['ol', {
    reserved: false
  }], ['optgroup', {
    reserved: false
  }], ['option', {
    reserved: false
  }], ['output', {
    reserved: false
  }], ['p', {
    reserved: false
  }], ['param', {
    reserved: true
  }], ['picture', {
    reserved: true
  }], ['pre', {
    reserved: false
  }], ['progress', {
    reserved: false
  }], ['q', {
    reserved: false
  }], ['rp', {
    reserved: false
  }], ['rt', {
    reserved: false
  }], ['rtc', {
    reserved: false
  }], ['ruby', {
    reserved: false
  }], ['s', {
    reserved: false
  }], ['samp', {
    reserved: false
  }], ['script', {
    reserved: true
  }], ['section', {
    reserved: false
  }], ['select', {
    reserved: false
  }], ['small', {
    reserved: false
  }], ['source', {
    reserved: true
  }], ['spacer', {
    reserved: false
  }], ['span', {
    reserved: false
  }], ['strike', {
    reserved: false
  }], ['strong', {
    reserved: false
  }], ['style', {
    reserved: true
  }], ['sub', {
    reserved: false
  }], ['summary', {
    reserved: false
  }], ['sup', {
    reserved: false
  }], ['table', {
    reserved: false
  }], ['tbody', {
    reserved: false
  }], ['td', {
    reserved: false
  }], ['textarea', {
    reserved: false
  }], ['tfoot', {
    reserved: false
  }], ['th', {
    reserved: false
  }], ['thead', {
    reserved: false
  }], ['time', {
    reserved: false
  }], ['title', {
    reserved: true
  }], ['tr', {
    reserved: false
  }], ['track', {
    reserved: true
  }], ['tt', {
    reserved: false
  }], ['u', {
    reserved: false
  }], ['ul', {
    reserved: false
  }], ['var', {
    reserved: false
  }], ['video', {
    reserved: false
  }], ['wbr', {
    reserved: false
  }], ['xmp', {
    reserved: false
  }]];
  var domMap = {
    entries: function entries() {
      return dom$1;
    },
    get: function get(key) {
      var item = dom$1.find(function (tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return dom$1.map(function (_ref) {
        var _ref2 = _slicedToArray$3(_ref, 1),
            key = _ref2[0];

        return key;
      });
    },
    values: function values() {
      return dom$1.map(function (_ref3) {
        var _ref4 = _slicedToArray$3(_ref3, 2),
            values = _ref4[1];

        return values;
      });
    }
  };
  var _default$2b = domMap;
  domMap$1.default = _default$2b;

  var rolesMap$1 = {};

  var ariaAbstractRoles$1 = {};

  var commandRole$1 = {};

  Object.defineProperty(commandRole$1, "__esModule", {
    value: true
  });
  commandRole$1.default = void 0;
  var commandRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'menuitem'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget']]
  };
  var _default$2a = commandRole;
  commandRole$1.default = _default$2a;

  var compositeRole$1 = {};

  Object.defineProperty(compositeRole$1, "__esModule", {
    value: true
  });
  compositeRole$1.default = void 0;
  var compositeRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-activedescendant': null,
      'aria-disabled': null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget']]
  };
  var _default$29 = compositeRole;
  compositeRole$1.default = _default$29;

  var inputRole$1 = {};

  Object.defineProperty(inputRole$1, "__esModule", {
    value: true
  });
  inputRole$1.default = void 0;
  var inputRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null
    },
    relatedConcepts: [{
      concept: {
        name: 'input'
      },
      module: 'XForms'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget']]
  };
  var _default$28 = inputRole;
  inputRole$1.default = _default$28;

  var landmarkRole$1 = {};

  Object.defineProperty(landmarkRole$1, "__esModule", {
    value: true
  });
  landmarkRole$1.default = void 0;
  var landmarkRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$27 = landmarkRole;
  landmarkRole$1.default = _default$27;

  var rangeRole$1 = {};

  Object.defineProperty(rangeRole$1, "__esModule", {
    value: true
  });
  rangeRole$1.default = void 0;
  var rangeRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-valuemax': null,
      'aria-valuemin': null,
      'aria-valuenow': null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$26 = rangeRole;
  rangeRole$1.default = _default$26;

  var roletypeRole$1 = {};

  Object.defineProperty(roletypeRole$1, "__esModule", {
    value: true
  });
  roletypeRole$1.default = void 0;
  var roletypeRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {
      'aria-atomic': null,
      'aria-busy': null,
      'aria-controls': null,
      'aria-current': null,
      'aria-describedby': null,
      'aria-details': null,
      'aria-dropeffect': null,
      'aria-flowto': null,
      'aria-grabbed': null,
      'aria-hidden': null,
      'aria-keyshortcuts': null,
      'aria-label': null,
      'aria-labelledby': null,
      'aria-live': null,
      'aria-owns': null,
      'aria-relevant': null,
      'aria-roledescription': null
    },
    relatedConcepts: [{
      concept: {
        name: 'rel'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'role'
      },
      module: 'XHTML'
    }, {
      concept: {
        name: 'type'
      },
      module: 'Dublin Core'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: []
  };
  var _default$25 = roletypeRole;
  roletypeRole$1.default = _default$25;

  var sectionRole$1 = {};

  Object.defineProperty(sectionRole$1, "__esModule", {
    value: true
  });
  sectionRole$1.default = void 0;
  var sectionRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'frontmatter'
      },
      module: 'DTB'
    }, {
      concept: {
        name: 'level'
      },
      module: 'DTB'
    }, {
      concept: {
        name: 'level'
      },
      module: 'SMIL'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$24 = sectionRole;
  sectionRole$1.default = _default$24;

  var sectionheadRole$1 = {};

  Object.defineProperty(sectionheadRole$1, "__esModule", {
    value: true
  });
  sectionheadRole$1.default = void 0;
  var sectionheadRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$23 = sectionheadRole;
  sectionheadRole$1.default = _default$23;

  var selectRole$1 = {};

  Object.defineProperty(selectRole$1, "__esModule", {
    value: true
  });
  selectRole$1.default = void 0;
  var selectRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-orientation': null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite'], ['roletype', 'structure', 'section', 'group']]
  };
  var _default$22 = selectRole;
  selectRole$1.default = _default$22;

  var structureRole$1 = {};

  Object.defineProperty(structureRole$1, "__esModule", {
    value: true
  });
  structureRole$1.default = void 0;
  var structureRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype']]
  };
  var _default$21 = structureRole;
  structureRole$1.default = _default$21;

  var widgetRole$1 = {};

  Object.defineProperty(widgetRole$1, "__esModule", {
    value: true
  });
  widgetRole$1.default = void 0;
  var widgetRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype']]
  };
  var _default$20 = widgetRole;
  widgetRole$1.default = _default$20;

  var windowRole$1 = {};

  Object.defineProperty(windowRole$1, "__esModule", {
    value: true
  });
  windowRole$1.default = void 0;
  var windowRole = {
    abstract: true,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-modal': null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype']]
  };
  var _default$1$ = windowRole;
  windowRole$1.default = _default$1$;

  Object.defineProperty(ariaAbstractRoles$1, "__esModule", {
    value: true
  });
  ariaAbstractRoles$1.default = void 0;

  var _commandRole = _interopRequireDefault$6(commandRole$1);

  var _compositeRole = _interopRequireDefault$6(compositeRole$1);

  var _inputRole = _interopRequireDefault$6(inputRole$1);

  var _landmarkRole = _interopRequireDefault$6(landmarkRole$1);

  var _rangeRole = _interopRequireDefault$6(rangeRole$1);

  var _roletypeRole = _interopRequireDefault$6(roletypeRole$1);

  var _sectionRole = _interopRequireDefault$6(sectionRole$1);

  var _sectionheadRole = _interopRequireDefault$6(sectionheadRole$1);

  var _selectRole = _interopRequireDefault$6(selectRole$1);

  var _structureRole = _interopRequireDefault$6(structureRole$1);

  var _widgetRole = _interopRequireDefault$6(widgetRole$1);

  var _windowRole = _interopRequireDefault$6(windowRole$1);

  function _interopRequireDefault$6(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var ariaAbstractRoles = [['command', _commandRole.default], ['composite', _compositeRole.default], ['input', _inputRole.default], ['landmark', _landmarkRole.default], ['range', _rangeRole.default], ['roletype', _roletypeRole.default], ['section', _sectionRole.default], ['sectionhead', _sectionheadRole.default], ['select', _selectRole.default], ['structure', _structureRole.default], ['widget', _widgetRole.default], ['window', _windowRole.default]];
  var _default$1_ = ariaAbstractRoles;
  ariaAbstractRoles$1.default = _default$1_;

  var ariaLiteralRoles$1 = {};

  var alertRole$1 = {};

  Object.defineProperty(alertRole$1, "__esModule", {
    value: true
  });
  alertRole$1.default = void 0;
  var alertRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-atomic': 'true',
      'aria-live': 'assertive'
    },
    relatedConcepts: [{
      concept: {
        name: 'alert'
      },
      module: 'XForms'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1Z = alertRole;
  alertRole$1.default = _default$1Z;

  var alertdialogRole$1 = {};

  Object.defineProperty(alertdialogRole$1, "__esModule", {
    value: true
  });
  alertdialogRole$1.default = void 0;
  var alertdialogRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'alert'
      },
      module: 'XForms'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'alert'], ['roletype', 'window', 'dialog']]
  };
  var _default$1Y = alertdialogRole;
  alertdialogRole$1.default = _default$1Y;

  var applicationRole$1 = {};

  Object.defineProperty(applicationRole$1, "__esModule", {
    value: true
  });
  applicationRole$1.default = void 0;
  var applicationRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-activedescendant': null,
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'Device Independence Delivery Unit'
      }
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$1X = applicationRole;
  applicationRole$1.default = _default$1X;

  var articleRole$1 = {};

  Object.defineProperty(articleRole$1, "__esModule", {
    value: true
  });
  articleRole$1.default = void 0;
  var articleRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-posinset': null,
      'aria-setsize': null
    },
    relatedConcepts: [{
      concept: {
        name: 'article'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'document']]
  };
  var _default$1W = articleRole;
  articleRole$1.default = _default$1W;

  var bannerRole$1 = {};

  Object.defineProperty(bannerRole$1, "__esModule", {
    value: true
  });
  bannerRole$1.default = void 0;
  var bannerRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        constraints: ['direct descendant of document'],
        name: 'header'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$1V = bannerRole;
  bannerRole$1.default = _default$1V;

  var blockquoteRole$1 = {};

  Object.defineProperty(blockquoteRole$1, "__esModule", {
    value: true
  });
  blockquoteRole$1.default = void 0;
  var blockquoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1U = blockquoteRole;
  blockquoteRole$1.default = _default$1U;

  var buttonRole$1 = {};

  Object.defineProperty(buttonRole$1, "__esModule", {
    value: true
  });
  buttonRole$1.default = void 0;
  var buttonRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-pressed': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'aria-pressed'
        }, {
          name: 'type',
          value: 'checkbox'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'aria-expanded',
          value: 'false'
        }],
        name: 'summary'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'aria-expanded',
          value: 'true'
        }],
        constraints: ['direct descendant of details element with the open attribute defined'],
        name: 'summary'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'type',
          value: 'button'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'type',
          value: 'image'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'type',
          value: 'reset'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'type',
          value: 'submit'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'button'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'trigger'
      },
      module: 'XForms'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'command']]
  };
  var _default$1T = buttonRole;
  buttonRole$1.default = _default$1T;

  var captionRole$1 = {};

  Object.defineProperty(captionRole$1, "__esModule", {
    value: true
  });
  captionRole$1.default = void 0;
  var captionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: ['figure', 'grid', 'table'],
    requiredContextRole: ['figure', 'grid', 'table'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1S = captionRole;
  captionRole$1.default = _default$1S;

  var cellRole$1 = {};

  Object.defineProperty(cellRole$1, "__esModule", {
    value: true
  });
  cellRole$1.default = void 0;
  var cellRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-colindex': null,
      'aria-colspan': null,
      'aria-rowindex': null,
      'aria-rowspan': null
    },
    relatedConcepts: [{
      concept: {
        constraints: ['descendant of table'],
        name: 'td'
      },
      module: 'HTML'
    }],
    requireContextRole: ['row'],
    requiredContextRole: ['row'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1R = cellRole;
  cellRole$1.default = _default$1R;

  var checkboxRole$1 = {};

  Object.defineProperty(checkboxRole$1, "__esModule", {
    value: true
  });
  checkboxRole$1.default = void 0;
  var checkboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-checked': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-invalid': null,
      'aria-readonly': null,
      'aria-required': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'type',
          value: 'checkbox'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'option'
      },
      module: 'ARIA'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-checked': null
    },
    superClass: [['roletype', 'widget', 'input']]
  };
  var _default$1Q = checkboxRole;
  checkboxRole$1.default = _default$1Q;

  var codeRole$1 = {};

  Object.defineProperty(codeRole$1, "__esModule", {
    value: true
  });
  codeRole$1.default = void 0;
  var codeRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1P = codeRole;
  codeRole$1.default = _default$1P;

  var columnheaderRole$1 = {};

  Object.defineProperty(columnheaderRole$1, "__esModule", {
    value: true
  });
  columnheaderRole$1.default = void 0;
  var columnheaderRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-sort': null
    },
    relatedConcepts: [{
      attributes: [{
        name: 'scope',
        value: 'col'
      }],
      concept: {
        name: 'th'
      },
      module: 'HTML'
    }],
    requireContextRole: ['row'],
    requiredContextRole: ['row'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'cell'], ['roletype', 'structure', 'section', 'cell', 'gridcell'], ['roletype', 'widget', 'gridcell'], ['roletype', 'structure', 'sectionhead']]
  };
  var _default$1O = columnheaderRole;
  columnheaderRole$1.default = _default$1O;

  var comboboxRole$1 = {};

  Object.defineProperty(comboboxRole$1, "__esModule", {
    value: true
  });
  comboboxRole$1.default = void 0;
  var comboboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-activedescendant': null,
      'aria-autocomplete': null,
      'aria-errormessage': null,
      'aria-invalid': null,
      'aria-readonly': null,
      'aria-required': null,
      'aria-expanded': 'false',
      'aria-haspopup': 'listbox'
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'list'
        }, {
          name: 'type',
          value: 'email'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'list'
        }, {
          name: 'type',
          value: 'search'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'list'
        }, {
          name: 'type',
          value: 'tel'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'list'
        }, {
          name: 'type',
          value: 'text'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'list'
        }, {
          name: 'type',
          value: 'url'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'list'
        }, {
          name: 'type',
          value: 'url'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'multiple'
        }, {
          constraints: ['undefined'],
          name: 'size'
        }],
        name: 'select'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'multiple'
        }, {
          name: 'size',
          value: 1
        }],
        name: 'select'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'select'
      },
      module: 'XForms'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-controls': null,
      'aria-expanded': 'false'
    },
    superClass: [['roletype', 'widget', 'input']]
  };
  var _default$1N = comboboxRole;
  comboboxRole$1.default = _default$1N;

  var complementaryRole$1 = {};

  Object.defineProperty(complementaryRole$1, "__esModule", {
    value: true
  });
  complementaryRole$1.default = void 0;
  var complementaryRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'aside'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$1M = complementaryRole;
  complementaryRole$1.default = _default$1M;

  var contentinfoRole$1 = {};

  Object.defineProperty(contentinfoRole$1, "__esModule", {
    value: true
  });
  contentinfoRole$1.default = void 0;
  var contentinfoRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        constraints: ['direct descendant of document'],
        name: 'footer'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$1L = contentinfoRole;
  contentinfoRole$1.default = _default$1L;

  var definitionRole$1 = {};

  Object.defineProperty(definitionRole$1, "__esModule", {
    value: true
  });
  definitionRole$1.default = void 0;
  var definitionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'dd'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1K = definitionRole;
  definitionRole$1.default = _default$1K;

  var deletionRole$1 = {};

  Object.defineProperty(deletionRole$1, "__esModule", {
    value: true
  });
  deletionRole$1.default = void 0;
  var deletionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1J = deletionRole;
  deletionRole$1.default = _default$1J;

  var dialogRole$1 = {};

  Object.defineProperty(dialogRole$1, "__esModule", {
    value: true
  });
  dialogRole$1.default = void 0;
  var dialogRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'dialog'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'window']]
  };
  var _default$1I = dialogRole;
  dialogRole$1.default = _default$1I;

  var directoryRole$1 = {};

  Object.defineProperty(directoryRole$1, "__esModule", {
    value: true
  });
  directoryRole$1.default = void 0;
  var directoryRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      module: 'DAISY Guide'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'list']]
  };
  var _default$1H = directoryRole;
  directoryRole$1.default = _default$1H;

  var documentRole$1 = {};

  Object.defineProperty(documentRole$1, "__esModule", {
    value: true
  });
  documentRole$1.default = void 0;
  var documentRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'Device Independence Delivery Unit'
      }
    }, {
      concept: {
        name: 'body'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$1G = documentRole;
  documentRole$1.default = _default$1G;

  var emphasisRole$1 = {};

  Object.defineProperty(emphasisRole$1, "__esModule", {
    value: true
  });
  emphasisRole$1.default = void 0;
  var emphasisRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1F = emphasisRole;
  emphasisRole$1.default = _default$1F;

  var feedRole$1 = {};

  Object.defineProperty(feedRole$1, "__esModule", {
    value: true
  });
  feedRole$1.default = void 0;
  var feedRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['article']],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'list']]
  };
  var _default$1E = feedRole;
  feedRole$1.default = _default$1E;

  var figureRole$1 = {};

  Object.defineProperty(figureRole$1, "__esModule", {
    value: true
  });
  figureRole$1.default = void 0;
  var figureRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'figure'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1D = figureRole;
  figureRole$1.default = _default$1D;

  var formRole$1 = {};

  Object.defineProperty(formRole$1, "__esModule", {
    value: true
  });
  formRole$1.default = void 0;
  var formRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'aria-label'
        }],
        name: 'form'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'aria-labelledby'
        }],
        name: 'form'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'name'
        }],
        name: 'form'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$1C = formRole;
  formRole$1.default = _default$1C;

  var genericRole$1 = {};

  Object.defineProperty(genericRole$1, "__esModule", {
    value: true
  });
  genericRole$1.default = void 0;
  var genericRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'span'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'div'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$1B = genericRole;
  genericRole$1.default = _default$1B;

  var gridRole$1 = {};

  Object.defineProperty(gridRole$1, "__esModule", {
    value: true
  });
  gridRole$1.default = void 0;
  var gridRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-multiselectable': null,
      'aria-readonly': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'role',
          value: 'grid'
        }],
        name: 'table'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['row'], ['row', 'rowgroup']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite'], ['roletype', 'structure', 'section', 'table']]
  };
  var _default$1A = gridRole;
  gridRole$1.default = _default$1A;

  var gridcellRole$1 = {};

  Object.defineProperty(gridcellRole$1, "__esModule", {
    value: true
  });
  gridcellRole$1.default = void 0;
  var gridcellRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null,
      'aria-readonly': null,
      'aria-required': null,
      'aria-selected': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'role',
          value: 'gridcell'
        }],
        name: 'td'
      },
      module: 'HTML'
    }],
    requireContextRole: ['row'],
    requiredContextRole: ['row'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'cell'], ['roletype', 'widget']]
  };
  var _default$1z = gridcellRole;
  gridcellRole$1.default = _default$1z;

  var groupRole$1 = {};

  Object.defineProperty(groupRole$1, "__esModule", {
    value: true
  });
  groupRole$1.default = void 0;
  var groupRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-activedescendant': null,
      'aria-disabled': null
    },
    relatedConcepts: [{
      concept: {
        name: 'details'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'fieldset'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'optgroup'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1y = groupRole;
  groupRole$1.default = _default$1y;

  var headingRole$1 = {};

  Object.defineProperty(headingRole$1, "__esModule", {
    value: true
  });
  headingRole$1.default = void 0;
  var headingRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-level': '2'
    },
    relatedConcepts: [{
      concept: {
        name: 'h1'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'h2'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'h3'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'h4'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'h5'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'h6'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-level': '2'
    },
    superClass: [['roletype', 'structure', 'sectionhead']]
  };
  var _default$1x = headingRole;
  headingRole$1.default = _default$1x;

  var imgRole$1 = {};

  Object.defineProperty(imgRole$1, "__esModule", {
    value: true
  });
  imgRole$1.default = void 0;
  var imgRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'alt'
        }],
        name: 'img'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'alt'
        }],
        name: 'img'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'imggroup'
      },
      module: 'DTB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1w = imgRole;
  imgRole$1.default = _default$1w;

  var insertionRole$1 = {};

  Object.defineProperty(insertionRole$1, "__esModule", {
    value: true
  });
  insertionRole$1.default = void 0;
  var insertionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1v = insertionRole;
  insertionRole$1.default = _default$1v;

  var linkRole$1 = {};

  Object.defineProperty(linkRole$1, "__esModule", {
    value: true
  });
  linkRole$1.default = void 0;
  var linkRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-expanded': null,
      'aria-haspopup': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'href'
        }],
        name: 'a'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'href'
        }],
        name: 'area'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'href'
        }],
        name: 'link'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'command']]
  };
  var _default$1u = linkRole;
  linkRole$1.default = _default$1u;

  var listRole$1 = {};

  Object.defineProperty(listRole$1, "__esModule", {
    value: true
  });
  listRole$1.default = void 0;
  var listRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'menu'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'ol'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'ul'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['listitem']],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1t = listRole;
  listRole$1.default = _default$1t;

  var listboxRole$1 = {};

  Object.defineProperty(listboxRole$1, "__esModule", {
    value: true
  });
  listboxRole$1.default = void 0;
  var listboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-invalid': null,
      'aria-multiselectable': null,
      'aria-readonly': null,
      'aria-required': null,
      'aria-orientation': 'vertical'
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['>1'],
          name: 'size'
        }, {
          name: 'multiple'
        }],
        name: 'select'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['>1'],
          name: 'size'
        }],
        name: 'select'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          name: 'multiple'
        }],
        name: 'select'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'datalist'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'list'
      },
      module: 'ARIA'
    }, {
      concept: {
        name: 'select'
      },
      module: 'XForms'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['option', 'group'], ['option']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite', 'select'], ['roletype', 'structure', 'section', 'group', 'select']]
  };
  var _default$1s = listboxRole;
  listboxRole$1.default = _default$1s;

  var listitemRole$1 = {};

  Object.defineProperty(listitemRole$1, "__esModule", {
    value: true
  });
  listitemRole$1.default = void 0;
  var listitemRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-level': null,
      'aria-posinset': null,
      'aria-setsize': null
    },
    relatedConcepts: [{
      concept: {
        constraints: ['direct descendant of ol, ul or menu'],
        name: 'li'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'item'
      },
      module: 'XForms'
    }],
    requireContextRole: ['directory', 'list'],
    requiredContextRole: ['directory', 'list'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1r = listitemRole;
  listitemRole$1.default = _default$1r;

  var logRole$1 = {};

  Object.defineProperty(logRole$1, "__esModule", {
    value: true
  });
  logRole$1.default = void 0;
  var logRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-live': 'polite'
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1q = logRole;
  logRole$1.default = _default$1q;

  var mainRole$1 = {};

  Object.defineProperty(mainRole$1, "__esModule", {
    value: true
  });
  mainRole$1.default = void 0;
  var mainRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'main'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$1p = mainRole;
  mainRole$1.default = _default$1p;

  var marqueeRole$1 = {};

  Object.defineProperty(marqueeRole$1, "__esModule", {
    value: true
  });
  marqueeRole$1.default = void 0;
  var marqueeRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1o = marqueeRole;
  marqueeRole$1.default = _default$1o;

  var mathRole$1 = {};

  Object.defineProperty(mathRole$1, "__esModule", {
    value: true
  });
  mathRole$1.default = void 0;
  var mathRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'math'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1n = mathRole;
  mathRole$1.default = _default$1n;

  var menuRole$1 = {};

  Object.defineProperty(menuRole$1, "__esModule", {
    value: true
  });
  menuRole$1.default = void 0;
  var menuRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-orientation': 'vertical'
    },
    relatedConcepts: [{
      concept: {
        name: 'MENU'
      },
      module: 'JAPI'
    }, {
      concept: {
        name: 'list'
      },
      module: 'ARIA'
    }, {
      concept: {
        name: 'select'
      },
      module: 'XForms'
    }, {
      concept: {
        name: 'sidebar'
      },
      module: 'DTB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['menuitem', 'group'], ['menuitemradio', 'group'], ['menuitemcheckbox', 'group'], ['menuitem'], ['menuitemcheckbox'], ['menuitemradio']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite', 'select'], ['roletype', 'structure', 'section', 'group', 'select']]
  };
  var _default$1m = menuRole;
  menuRole$1.default = _default$1m;

  var menubarRole$1 = {};

  Object.defineProperty(menubarRole$1, "__esModule", {
    value: true
  });
  menubarRole$1.default = void 0;
  var menubarRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-orientation': 'horizontal'
    },
    relatedConcepts: [{
      concept: {
        name: 'toolbar'
      },
      module: 'ARIA'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['menuitem', 'group'], ['menuitemradio', 'group'], ['menuitemcheckbox', 'group'], ['menuitem'], ['menuitemcheckbox'], ['menuitemradio']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite', 'select', 'menu'], ['roletype', 'structure', 'section', 'group', 'select', 'menu']]
  };
  var _default$1l = menubarRole;
  menubarRole$1.default = _default$1l;

  var menuitemRole$1 = {};

  Object.defineProperty(menuitemRole$1, "__esModule", {
    value: true
  });
  menuitemRole$1.default = void 0;
  var menuitemRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-posinset': null,
      'aria-setsize': null
    },
    relatedConcepts: [{
      concept: {
        name: 'MENU_ITEM'
      },
      module: 'JAPI'
    }, {
      concept: {
        name: 'listitem'
      },
      module: 'ARIA'
    }, {
      concept: {
        name: 'menuitem'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'option'
      },
      module: 'ARIA'
    }],
    requireContextRole: ['group', 'menu', 'menubar'],
    requiredContextRole: ['group', 'menu', 'menubar'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'command']]
  };
  var _default$1k = menuitemRole;
  menuitemRole$1.default = _default$1k;

  var menuitemcheckboxRole$1 = {};

  Object.defineProperty(menuitemcheckboxRole$1, "__esModule", {
    value: true
  });
  menuitemcheckboxRole$1.default = void 0;
  var menuitemcheckboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'menuitem'
      },
      module: 'ARIA'
    }],
    requireContextRole: ['group', 'menu', 'menubar'],
    requiredContextRole: ['group', 'menu', 'menubar'],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-checked': null
    },
    superClass: [['roletype', 'widget', 'input', 'checkbox'], ['roletype', 'widget', 'command', 'menuitem']]
  };
  var _default$1j = menuitemcheckboxRole;
  menuitemcheckboxRole$1.default = _default$1j;

  var menuitemradioRole$1 = {};

  Object.defineProperty(menuitemradioRole$1, "__esModule", {
    value: true
  });
  menuitemradioRole$1.default = void 0;
  var menuitemradioRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'menuitem'
      },
      module: 'ARIA'
    }],
    requireContextRole: ['group', 'menu', 'menubar'],
    requiredContextRole: ['group', 'menu', 'menubar'],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-checked': null
    },
    superClass: [['roletype', 'widget', 'input', 'checkbox', 'menuitemcheckbox'], ['roletype', 'widget', 'command', 'menuitem', 'menuitemcheckbox'], ['roletype', 'widget', 'input', 'radio']]
  };
  var _default$1i = menuitemradioRole;
  menuitemradioRole$1.default = _default$1i;

  var meterRole$1 = {};

  Object.defineProperty(meterRole$1, "__esModule", {
    value: true
  });
  meterRole$1.default = void 0;
  var meterRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-valuetext': null,
      'aria-valuemax': '100',
      'aria-valuemin': '0'
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-valuenow': null
    },
    superClass: [['roletype', 'structure', 'range']]
  };
  var _default$1h = meterRole;
  meterRole$1.default = _default$1h;

  var navigationRole$1 = {};

  Object.defineProperty(navigationRole$1, "__esModule", {
    value: true
  });
  navigationRole$1.default = void 0;
  var navigationRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'nav'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$1g = navigationRole;
  navigationRole$1.default = _default$1g;

  var noneRole$1 = {};

  Object.defineProperty(noneRole$1, "__esModule", {
    value: true
  });
  noneRole$1.default = void 0;
  var noneRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: [],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: []
  };
  var _default$1f = noneRole;
  noneRole$1.default = _default$1f;

  var noteRole$1 = {};

  Object.defineProperty(noteRole$1, "__esModule", {
    value: true
  });
  noteRole$1.default = void 0;
  var noteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1e = noteRole;
  noteRole$1.default = _default$1e;

  var optionRole$1 = {};

  Object.defineProperty(optionRole$1, "__esModule", {
    value: true
  });
  optionRole$1.default = void 0;
  var optionRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-checked': null,
      'aria-posinset': null,
      'aria-setsize': null,
      'aria-selected': 'false'
    },
    relatedConcepts: [{
      concept: {
        name: 'item'
      },
      module: 'XForms'
    }, {
      concept: {
        name: 'listitem'
      },
      module: 'ARIA'
    }, {
      concept: {
        name: 'option'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-selected': 'false'
    },
    superClass: [['roletype', 'widget', 'input']]
  };
  var _default$1d = optionRole;
  optionRole$1.default = _default$1d;

  var paragraphRole$1 = {};

  Object.defineProperty(paragraphRole$1, "__esModule", {
    value: true
  });
  paragraphRole$1.default = void 0;
  var paragraphRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$1c = paragraphRole;
  paragraphRole$1.default = _default$1c;

  var presentationRole$1 = {};

  Object.defineProperty(presentationRole$1, "__esModule", {
    value: true
  });
  presentationRole$1.default = void 0;
  var presentationRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$1b = presentationRole;
  presentationRole$1.default = _default$1b;

  var progressbarRole$1 = {};

  Object.defineProperty(progressbarRole$1, "__esModule", {
    value: true
  });
  progressbarRole$1.default = void 0;
  var progressbarRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-valuetext': null
    },
    relatedConcepts: [{
      concept: {
        name: 'progress'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'status'
      },
      module: 'ARIA'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'range'], ['roletype', 'widget']]
  };
  var _default$1a = progressbarRole;
  progressbarRole$1.default = _default$1a;

  var radioRole$1 = {};

  Object.defineProperty(radioRole$1, "__esModule", {
    value: true
  });
  radioRole$1.default = void 0;
  var radioRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-checked': null,
      'aria-posinset': null,
      'aria-setsize': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'type',
          value: 'radio'
        }],
        name: 'input'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-checked': null
    },
    superClass: [['roletype', 'widget', 'input']]
  };
  var _default$19 = radioRole;
  radioRole$1.default = _default$19;

  var radiogroupRole$1 = {};

  Object.defineProperty(radiogroupRole$1, "__esModule", {
    value: true
  });
  radiogroupRole$1.default = void 0;
  var radiogroupRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-invalid': null,
      'aria-readonly': null,
      'aria-required': null
    },
    relatedConcepts: [{
      concept: {
        name: 'list'
      },
      module: 'ARIA'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['radio']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite', 'select'], ['roletype', 'structure', 'section', 'group', 'select']]
  };
  var _default$18 = radiogroupRole;
  radiogroupRole$1.default = _default$18;

  var regionRole$1 = {};

  Object.defineProperty(regionRole$1, "__esModule", {
    value: true
  });
  regionRole$1.default = void 0;
  var regionRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'aria-label'
        }],
        name: 'section'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['set'],
          name: 'aria-labelledby'
        }],
        name: 'section'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'Device Independence Glossart perceivable unit'
      }
    }, {
      concept: {
        name: 'frame'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$17 = regionRole;
  regionRole$1.default = _default$17;

  var rowRole$1 = {};

  Object.defineProperty(rowRole$1, "__esModule", {
    value: true
  });
  rowRole$1.default = void 0;
  var rowRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-colindex': null,
      'aria-expanded': null,
      'aria-level': null,
      'aria-posinset': null,
      'aria-rowindex': null,
      'aria-selected': null,
      'aria-setsize': null
    },
    relatedConcepts: [{
      concept: {
        name: 'tr'
      },
      module: 'HTML'
    }],
    requireContextRole: ['grid', 'rowgroup', 'table', 'treegrid'],
    requiredContextRole: ['grid', 'rowgroup', 'table', 'treegrid'],
    requiredOwnedElements: [['cell'], ['columnheader'], ['gridcell'], ['rowheader']],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'group'], ['roletype', 'widget']]
  };
  var _default$16 = rowRole;
  rowRole$1.default = _default$16;

  var rowgroupRole$1 = {};

  Object.defineProperty(rowgroupRole$1, "__esModule", {
    value: true
  });
  rowgroupRole$1.default = void 0;
  var rowgroupRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'tbody'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'tfoot'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'thead'
      },
      module: 'HTML'
    }],
    requireContextRole: ['grid', 'table', 'treegrid'],
    requiredContextRole: ['grid', 'table', 'treegrid'],
    requiredOwnedElements: [['row']],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$15 = rowgroupRole;
  rowgroupRole$1.default = _default$15;

  var rowheaderRole$1 = {};

  Object.defineProperty(rowheaderRole$1, "__esModule", {
    value: true
  });
  rowheaderRole$1.default = void 0;
  var rowheaderRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-sort': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'scope',
          value: 'row'
        }],
        name: 'th'
      },
      module: 'HTML'
    }],
    requireContextRole: ['row'],
    requiredContextRole: ['row'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'cell'], ['roletype', 'structure', 'section', 'cell', 'gridcell'], ['roletype', 'widget', 'gridcell'], ['roletype', 'structure', 'sectionhead']]
  };
  var _default$14 = rowheaderRole;
  rowheaderRole$1.default = _default$14;

  var scrollbarRole$1 = {};

  Object.defineProperty(scrollbarRole$1, "__esModule", {
    value: true
  });
  scrollbarRole$1.default = void 0;
  var scrollbarRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-valuetext': null,
      'aria-orientation': 'vertical',
      'aria-valuemax': '100',
      'aria-valuemin': '0'
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-controls': null,
      'aria-valuenow': null
    },
    superClass: [['roletype', 'structure', 'range'], ['roletype', 'widget']]
  };
  var _default$13 = scrollbarRole;
  scrollbarRole$1.default = _default$13;

  var searchRole$1 = {};

  Object.defineProperty(searchRole$1, "__esModule", {
    value: true
  });
  searchRole$1.default = void 0;
  var searchRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$12 = searchRole;
  searchRole$1.default = _default$12;

  var searchboxRole$1 = {};

  Object.defineProperty(searchboxRole$1, "__esModule", {
    value: true
  });
  searchboxRole$1.default = void 0;
  var searchboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'list'
        }, {
          name: 'type',
          value: 'search'
        }],
        name: 'input'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'input', 'textbox']]
  };
  var _default$11 = searchboxRole;
  searchboxRole$1.default = _default$11;

  var separatorRole$1 = {};

  Object.defineProperty(separatorRole$1, "__esModule", {
    value: true
  });
  separatorRole$1.default = void 0;
  var separatorRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-orientation': 'horizontal',
      'aria-valuemax': '100',
      'aria-valuemin': '0',
      'aria-valuenow': null,
      'aria-valuetext': null
    },
    relatedConcepts: [{
      concept: {
        name: 'hr'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure']]
  };
  var _default$10 = separatorRole;
  separatorRole$1.default = _default$10;

  var sliderRole$1 = {};

  Object.defineProperty(sliderRole$1, "__esModule", {
    value: true
  });
  sliderRole$1.default = void 0;
  var sliderRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-haspopup': null,
      'aria-invalid': null,
      'aria-readonly': null,
      'aria-valuetext': null,
      'aria-orientation': 'horizontal',
      'aria-valuemax': '100',
      'aria-valuemin': '0'
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'type',
          value: 'range'
        }],
        name: 'input'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-valuenow': null
    },
    superClass: [['roletype', 'widget', 'input'], ['roletype', 'structure', 'range']]
  };
  var _default$$ = sliderRole;
  sliderRole$1.default = _default$$;

  var spinbuttonRole$1 = {};

  Object.defineProperty(spinbuttonRole$1, "__esModule", {
    value: true
  });
  spinbuttonRole$1.default = void 0;
  var spinbuttonRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-invalid': null,
      'aria-readonly': null,
      'aria-required': null,
      'aria-valuetext': null,
      'aria-valuenow': '0'
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          name: 'type',
          value: 'number'
        }],
        name: 'input'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite'], ['roletype', 'widget', 'input'], ['roletype', 'structure', 'range']]
  };
  var _default$_ = spinbuttonRole;
  spinbuttonRole$1.default = _default$_;

  var statusRole$1 = {};

  Object.defineProperty(statusRole$1, "__esModule", {
    value: true
  });
  statusRole$1.default = void 0;
  var statusRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-atomic': 'true',
      'aria-live': 'polite'
    },
    relatedConcepts: [{
      concept: {
        name: 'output'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$Z = statusRole;
  statusRole$1.default = _default$Z;

  var strongRole$1 = {};

  Object.defineProperty(strongRole$1, "__esModule", {
    value: true
  });
  strongRole$1.default = void 0;
  var strongRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$Y = strongRole;
  strongRole$1.default = _default$Y;

  var subscriptRole$1 = {};

  Object.defineProperty(subscriptRole$1, "__esModule", {
    value: true
  });
  subscriptRole$1.default = void 0;
  var subscriptRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$X = subscriptRole;
  subscriptRole$1.default = _default$X;

  var superscriptRole$1 = {};

  Object.defineProperty(superscriptRole$1, "__esModule", {
    value: true
  });
  superscriptRole$1.default = void 0;
  var superscriptRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['prohibited'],
    prohibitedProps: ['aria-label', 'aria-labelledby'],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$W = superscriptRole;
  superscriptRole$1.default = _default$W;

  var switchRole$1 = {};

  Object.defineProperty(switchRole$1, "__esModule", {
    value: true
  });
  switchRole$1.default = void 0;
  var switchRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'button'
      },
      module: 'ARIA'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-checked': null
    },
    superClass: [['roletype', 'widget', 'input', 'checkbox']]
  };
  var _default$V = switchRole;
  switchRole$1.default = _default$V;

  var tabRole$1 = {};

  Object.defineProperty(tabRole$1, "__esModule", {
    value: true
  });
  tabRole$1.default = void 0;
  var tabRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-posinset': null,
      'aria-setsize': null,
      'aria-selected': 'false'
    },
    relatedConcepts: [],
    requireContextRole: ['tablist'],
    requiredContextRole: ['tablist'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'sectionhead'], ['roletype', 'widget']]
  };
  var _default$U = tabRole;
  tabRole$1.default = _default$U;

  var tableRole$1 = {};

  Object.defineProperty(tableRole$1, "__esModule", {
    value: true
  });
  tableRole$1.default = void 0;
  var tableRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-colcount': null,
      'aria-rowcount': null
    },
    relatedConcepts: [{
      concept: {
        name: 'table'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['row'], ['row', 'rowgroup']],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$T = tableRole;
  tableRole$1.default = _default$T;

  var tablistRole$1 = {};

  Object.defineProperty(tablistRole$1, "__esModule", {
    value: true
  });
  tablistRole$1.default = void 0;
  var tablistRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-level': null,
      'aria-multiselectable': null,
      'aria-orientation': 'horizontal'
    },
    relatedConcepts: [{
      module: 'DAISY',
      concept: {
        name: 'guide'
      }
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['tab']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite']]
  };
  var _default$S = tablistRole;
  tablistRole$1.default = _default$S;

  var tabpanelRole$1 = {};

  Object.defineProperty(tabpanelRole$1, "__esModule", {
    value: true
  });
  tabpanelRole$1.default = void 0;
  var tabpanelRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$R = tabpanelRole;
  tabpanelRole$1.default = _default$R;

  var termRole$1 = {};

  Object.defineProperty(termRole$1, "__esModule", {
    value: true
  });
  termRole$1.default = void 0;
  var termRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'dfn'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'dt'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$Q = termRole;
  termRole$1.default = _default$Q;

  var textboxRole$1 = {};

  Object.defineProperty(textboxRole$1, "__esModule", {
    value: true
  });
  textboxRole$1.default = void 0;
  var textboxRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-activedescendant': null,
      'aria-autocomplete': null,
      'aria-errormessage': null,
      'aria-haspopup': null,
      'aria-invalid': null,
      'aria-multiline': null,
      'aria-placeholder': null,
      'aria-readonly': null,
      'aria-required': null
    },
    relatedConcepts: [{
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'type'
        }, {
          constraints: ['undefined'],
          name: 'list'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'list'
        }, {
          name: 'type',
          value: 'email'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'list'
        }, {
          name: 'type',
          value: 'tel'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'list'
        }, {
          name: 'type',
          value: 'text'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        attributes: [{
          constraints: ['undefined'],
          name: 'list'
        }, {
          name: 'type',
          value: 'url'
        }],
        name: 'input'
      },
      module: 'HTML'
    }, {
      concept: {
        name: 'input'
      },
      module: 'XForms'
    }, {
      concept: {
        name: 'textarea'
      },
      module: 'HTML'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'input']]
  };
  var _default$P = textboxRole;
  textboxRole$1.default = _default$P;

  var timeRole$1 = {};

  Object.defineProperty(timeRole$1, "__esModule", {
    value: true
  });
  timeRole$1.default = void 0;
  var timeRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$O = timeRole;
  timeRole$1.default = _default$O;

  var timerRole$1 = {};

  Object.defineProperty(timerRole$1, "__esModule", {
    value: true
  });
  timerRole$1.default = void 0;
  var timerRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'status']]
  };
  var _default$N = timerRole;
  timerRole$1.default = _default$N;

  var toolbarRole$1 = {};

  Object.defineProperty(toolbarRole$1, "__esModule", {
    value: true
  });
  toolbarRole$1.default = void 0;
  var toolbarRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-orientation': 'horizontal'
    },
    relatedConcepts: [{
      concept: {
        name: 'menubar'
      },
      module: 'ARIA'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'group']]
  };
  var _default$M = toolbarRole;
  toolbarRole$1.default = _default$M;

  var tooltipRole$1 = {};

  Object.defineProperty(tooltipRole$1, "__esModule", {
    value: true
  });
  tooltipRole$1.default = void 0;
  var tooltipRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$L = tooltipRole;
  tooltipRole$1.default = _default$L;

  var treeRole$1 = {};

  Object.defineProperty(treeRole$1, "__esModule", {
    value: true
  });
  treeRole$1.default = void 0;
  var treeRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-invalid': null,
      'aria-multiselectable': null,
      'aria-required': null,
      'aria-orientation': 'vertical'
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['treeitem', 'group'], ['treeitem']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite', 'select'], ['roletype', 'structure', 'section', 'group', 'select']]
  };
  var _default$K = treeRole;
  treeRole$1.default = _default$K;

  var treegridRole$1 = {};

  Object.defineProperty(treegridRole$1, "__esModule", {
    value: true
  });
  treegridRole$1.default = void 0;
  var treegridRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['row'], ['row', 'rowgroup']],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'composite', 'grid'], ['roletype', 'structure', 'section', 'table', 'grid'], ['roletype', 'widget', 'composite', 'select', 'tree'], ['roletype', 'structure', 'section', 'group', 'select', 'tree']]
  };
  var _default$J = treegridRole;
  treegridRole$1.default = _default$J;

  var treeitemRole$1 = {};

  Object.defineProperty(treeitemRole$1, "__esModule", {
    value: true
  });
  treeitemRole$1.default = void 0;
  var treeitemRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-expanded': null,
      'aria-haspopup': null
    },
    relatedConcepts: [],
    requireContextRole: ['group', 'tree'],
    requiredContextRole: ['group', 'tree'],
    requiredOwnedElements: [],
    requiredProps: {
      'aria-selected': null
    },
    superClass: [['roletype', 'structure', 'section', 'listitem'], ['roletype', 'widget', 'input', 'option']]
  };
  var _default$I = treeitemRole;
  treeitemRole$1.default = _default$I;

  Object.defineProperty(ariaLiteralRoles$1, "__esModule", {
    value: true
  });
  ariaLiteralRoles$1.default = void 0;

  var _alertRole = _interopRequireDefault$5(alertRole$1);

  var _alertdialogRole = _interopRequireDefault$5(alertdialogRole$1);

  var _applicationRole = _interopRequireDefault$5(applicationRole$1);

  var _articleRole = _interopRequireDefault$5(articleRole$1);

  var _bannerRole = _interopRequireDefault$5(bannerRole$1);

  var _blockquoteRole = _interopRequireDefault$5(blockquoteRole$1);

  var _buttonRole = _interopRequireDefault$5(buttonRole$1);

  var _captionRole = _interopRequireDefault$5(captionRole$1);

  var _cellRole = _interopRequireDefault$5(cellRole$1);

  var _checkboxRole = _interopRequireDefault$5(checkboxRole$1);

  var _codeRole = _interopRequireDefault$5(codeRole$1);

  var _columnheaderRole = _interopRequireDefault$5(columnheaderRole$1);

  var _comboboxRole = _interopRequireDefault$5(comboboxRole$1);

  var _complementaryRole = _interopRequireDefault$5(complementaryRole$1);

  var _contentinfoRole = _interopRequireDefault$5(contentinfoRole$1);

  var _definitionRole = _interopRequireDefault$5(definitionRole$1);

  var _deletionRole = _interopRequireDefault$5(deletionRole$1);

  var _dialogRole = _interopRequireDefault$5(dialogRole$1);

  var _directoryRole = _interopRequireDefault$5(directoryRole$1);

  var _documentRole = _interopRequireDefault$5(documentRole$1);

  var _emphasisRole = _interopRequireDefault$5(emphasisRole$1);

  var _feedRole = _interopRequireDefault$5(feedRole$1);

  var _figureRole = _interopRequireDefault$5(figureRole$1);

  var _formRole = _interopRequireDefault$5(formRole$1);

  var _genericRole = _interopRequireDefault$5(genericRole$1);

  var _gridRole = _interopRequireDefault$5(gridRole$1);

  var _gridcellRole = _interopRequireDefault$5(gridcellRole$1);

  var _groupRole = _interopRequireDefault$5(groupRole$1);

  var _headingRole = _interopRequireDefault$5(headingRole$1);

  var _imgRole = _interopRequireDefault$5(imgRole$1);

  var _insertionRole = _interopRequireDefault$5(insertionRole$1);

  var _linkRole = _interopRequireDefault$5(linkRole$1);

  var _listRole = _interopRequireDefault$5(listRole$1);

  var _listboxRole = _interopRequireDefault$5(listboxRole$1);

  var _listitemRole = _interopRequireDefault$5(listitemRole$1);

  var _logRole = _interopRequireDefault$5(logRole$1);

  var _mainRole = _interopRequireDefault$5(mainRole$1);

  var _marqueeRole = _interopRequireDefault$5(marqueeRole$1);

  var _mathRole = _interopRequireDefault$5(mathRole$1);

  var _menuRole = _interopRequireDefault$5(menuRole$1);

  var _menubarRole = _interopRequireDefault$5(menubarRole$1);

  var _menuitemRole = _interopRequireDefault$5(menuitemRole$1);

  var _menuitemcheckboxRole = _interopRequireDefault$5(menuitemcheckboxRole$1);

  var _menuitemradioRole = _interopRequireDefault$5(menuitemradioRole$1);

  var _meterRole = _interopRequireDefault$5(meterRole$1);

  var _navigationRole = _interopRequireDefault$5(navigationRole$1);

  var _noneRole = _interopRequireDefault$5(noneRole$1);

  var _noteRole = _interopRequireDefault$5(noteRole$1);

  var _optionRole = _interopRequireDefault$5(optionRole$1);

  var _paragraphRole = _interopRequireDefault$5(paragraphRole$1);

  var _presentationRole = _interopRequireDefault$5(presentationRole$1);

  var _progressbarRole = _interopRequireDefault$5(progressbarRole$1);

  var _radioRole = _interopRequireDefault$5(radioRole$1);

  var _radiogroupRole = _interopRequireDefault$5(radiogroupRole$1);

  var _regionRole = _interopRequireDefault$5(regionRole$1);

  var _rowRole = _interopRequireDefault$5(rowRole$1);

  var _rowgroupRole = _interopRequireDefault$5(rowgroupRole$1);

  var _rowheaderRole = _interopRequireDefault$5(rowheaderRole$1);

  var _scrollbarRole = _interopRequireDefault$5(scrollbarRole$1);

  var _searchRole = _interopRequireDefault$5(searchRole$1);

  var _searchboxRole = _interopRequireDefault$5(searchboxRole$1);

  var _separatorRole = _interopRequireDefault$5(separatorRole$1);

  var _sliderRole = _interopRequireDefault$5(sliderRole$1);

  var _spinbuttonRole = _interopRequireDefault$5(spinbuttonRole$1);

  var _statusRole = _interopRequireDefault$5(statusRole$1);

  var _strongRole = _interopRequireDefault$5(strongRole$1);

  var _subscriptRole = _interopRequireDefault$5(subscriptRole$1);

  var _superscriptRole = _interopRequireDefault$5(superscriptRole$1);

  var _switchRole = _interopRequireDefault$5(switchRole$1);

  var _tabRole = _interopRequireDefault$5(tabRole$1);

  var _tableRole = _interopRequireDefault$5(tableRole$1);

  var _tablistRole = _interopRequireDefault$5(tablistRole$1);

  var _tabpanelRole = _interopRequireDefault$5(tabpanelRole$1);

  var _termRole = _interopRequireDefault$5(termRole$1);

  var _textboxRole = _interopRequireDefault$5(textboxRole$1);

  var _timeRole = _interopRequireDefault$5(timeRole$1);

  var _timerRole = _interopRequireDefault$5(timerRole$1);

  var _toolbarRole = _interopRequireDefault$5(toolbarRole$1);

  var _tooltipRole = _interopRequireDefault$5(tooltipRole$1);

  var _treeRole = _interopRequireDefault$5(treeRole$1);

  var _treegridRole = _interopRequireDefault$5(treegridRole$1);

  var _treeitemRole = _interopRequireDefault$5(treeitemRole$1);

  function _interopRequireDefault$5(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var ariaLiteralRoles = [['alert', _alertRole.default], ['alertdialog', _alertdialogRole.default], ['application', _applicationRole.default], ['article', _articleRole.default], ['banner', _bannerRole.default], ['blockquote', _blockquoteRole.default], ['button', _buttonRole.default], ['caption', _captionRole.default], ['cell', _cellRole.default], ['checkbox', _checkboxRole.default], ['code', _codeRole.default], ['columnheader', _columnheaderRole.default], ['combobox', _comboboxRole.default], ['complementary', _complementaryRole.default], ['contentinfo', _contentinfoRole.default], ['definition', _definitionRole.default], ['deletion', _deletionRole.default], ['dialog', _dialogRole.default], ['directory', _directoryRole.default], ['document', _documentRole.default], ['emphasis', _emphasisRole.default], ['feed', _feedRole.default], ['figure', _figureRole.default], ['form', _formRole.default], ['generic', _genericRole.default], ['grid', _gridRole.default], ['gridcell', _gridcellRole.default], ['group', _groupRole.default], ['heading', _headingRole.default], ['img', _imgRole.default], ['insertion', _insertionRole.default], ['link', _linkRole.default], ['list', _listRole.default], ['listbox', _listboxRole.default], ['listitem', _listitemRole.default], ['log', _logRole.default], ['main', _mainRole.default], ['marquee', _marqueeRole.default], ['math', _mathRole.default], ['menu', _menuRole.default], ['menubar', _menubarRole.default], ['menuitem', _menuitemRole.default], ['menuitemcheckbox', _menuitemcheckboxRole.default], ['menuitemradio', _menuitemradioRole.default], ['meter', _meterRole.default], ['navigation', _navigationRole.default], ['none', _noneRole.default], ['note', _noteRole.default], ['option', _optionRole.default], ['paragraph', _paragraphRole.default], ['presentation', _presentationRole.default], ['progressbar', _progressbarRole.default], ['radio', _radioRole.default], ['radiogroup', _radiogroupRole.default], ['region', _regionRole.default], ['row', _rowRole.default], ['rowgroup', _rowgroupRole.default], ['rowheader', _rowheaderRole.default], ['scrollbar', _scrollbarRole.default], ['search', _searchRole.default], ['searchbox', _searchboxRole.default], ['separator', _separatorRole.default], ['slider', _sliderRole.default], ['spinbutton', _spinbuttonRole.default], ['status', _statusRole.default], ['strong', _strongRole.default], ['subscript', _subscriptRole.default], ['superscript', _superscriptRole.default], ['switch', _switchRole.default], ['tab', _tabRole.default], ['table', _tableRole.default], ['tablist', _tablistRole.default], ['tabpanel', _tabpanelRole.default], ['term', _termRole.default], ['textbox', _textboxRole.default], ['time', _timeRole.default], ['timer', _timerRole.default], ['toolbar', _toolbarRole.default], ['tooltip', _tooltipRole.default], ['tree', _treeRole.default], ['treegrid', _treegridRole.default], ['treeitem', _treeitemRole.default]];
  var _default$H = ariaLiteralRoles;
  ariaLiteralRoles$1.default = _default$H;

  var ariaDpubRoles$1 = {};

  var docAbstractRole$1 = {};

  Object.defineProperty(docAbstractRole$1, "__esModule", {
    value: true
  });
  docAbstractRole$1.default = void 0;
  var docAbstractRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'abstract [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$G = docAbstractRole;
  docAbstractRole$1.default = _default$G;

  var docAcknowledgmentsRole$1 = {};

  Object.defineProperty(docAcknowledgmentsRole$1, "__esModule", {
    value: true
  });
  docAcknowledgmentsRole$1.default = void 0;
  var docAcknowledgmentsRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'acknowledgments [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$F = docAcknowledgmentsRole;
  docAcknowledgmentsRole$1.default = _default$F;

  var docAfterwordRole$1 = {};

  Object.defineProperty(docAfterwordRole$1, "__esModule", {
    value: true
  });
  docAfterwordRole$1.default = void 0;
  var docAfterwordRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'afterword [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$E = docAfterwordRole;
  docAfterwordRole$1.default = _default$E;

  var docAppendixRole$1 = {};

  Object.defineProperty(docAppendixRole$1, "__esModule", {
    value: true
  });
  docAppendixRole$1.default = void 0;
  var docAppendixRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'appendix [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$D = docAppendixRole;
  docAppendixRole$1.default = _default$D;

  var docBacklinkRole$1 = {};

  Object.defineProperty(docBacklinkRole$1, "__esModule", {
    value: true
  });
  docBacklinkRole$1.default = void 0;
  var docBacklinkRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'content'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'referrer [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'command', 'link']]
  };
  var _default$C = docBacklinkRole;
  docBacklinkRole$1.default = _default$C;

  var docBiblioentryRole$1 = {};

  Object.defineProperty(docBiblioentryRole$1, "__esModule", {
    value: true
  });
  docBiblioentryRole$1.default = void 0;
  var docBiblioentryRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'EPUB biblioentry [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: ['doc-bibliography'],
    requiredContextRole: ['doc-bibliography'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'listitem']]
  };
  var _default$B = docBiblioentryRole;
  docBiblioentryRole$1.default = _default$B;

  var docBibliographyRole$1 = {};

  Object.defineProperty(docBibliographyRole$1, "__esModule", {
    value: true
  });
  docBibliographyRole$1.default = void 0;
  var docBibliographyRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'bibliography [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['doc-biblioentry']],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$A = docBibliographyRole;
  docBibliographyRole$1.default = _default$A;

  var docBibliorefRole$1 = {};

  Object.defineProperty(docBibliorefRole$1, "__esModule", {
    value: true
  });
  docBibliorefRole$1.default = void 0;
  var docBibliorefRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'biblioref [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'command', 'link']]
  };
  var _default$z = docBibliorefRole;
  docBibliorefRole$1.default = _default$z;

  var docChapterRole$1 = {};

  Object.defineProperty(docChapterRole$1, "__esModule", {
    value: true
  });
  docChapterRole$1.default = void 0;
  var docChapterRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'chapter [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$y = docChapterRole;
  docChapterRole$1.default = _default$y;

  var docColophonRole$1 = {};

  Object.defineProperty(docColophonRole$1, "__esModule", {
    value: true
  });
  docColophonRole$1.default = void 0;
  var docColophonRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'colophon [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$x = docColophonRole;
  docColophonRole$1.default = _default$x;

  var docConclusionRole$1 = {};

  Object.defineProperty(docConclusionRole$1, "__esModule", {
    value: true
  });
  docConclusionRole$1.default = void 0;
  var docConclusionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'conclusion [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$w = docConclusionRole;
  docConclusionRole$1.default = _default$w;

  var docCoverRole$1 = {};

  Object.defineProperty(docCoverRole$1, "__esModule", {
    value: true
  });
  docCoverRole$1.default = void 0;
  var docCoverRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'cover [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'img']]
  };
  var _default$v = docCoverRole;
  docCoverRole$1.default = _default$v;

  var docCreditRole$1 = {};

  Object.defineProperty(docCreditRole$1, "__esModule", {
    value: true
  });
  docCreditRole$1.default = void 0;
  var docCreditRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'credit [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$u = docCreditRole;
  docCreditRole$1.default = _default$u;

  var docCreditsRole$1 = {};

  Object.defineProperty(docCreditsRole$1, "__esModule", {
    value: true
  });
  docCreditsRole$1.default = void 0;
  var docCreditsRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'credits [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$t = docCreditsRole;
  docCreditsRole$1.default = _default$t;

  var docDedicationRole$1 = {};

  Object.defineProperty(docDedicationRole$1, "__esModule", {
    value: true
  });
  docDedicationRole$1.default = void 0;
  var docDedicationRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'dedication [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$s = docDedicationRole;
  docDedicationRole$1.default = _default$s;

  var docEndnoteRole$1 = {};

  Object.defineProperty(docEndnoteRole$1, "__esModule", {
    value: true
  });
  docEndnoteRole$1.default = void 0;
  var docEndnoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'rearnote [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: ['doc-endnotes'],
    requiredContextRole: ['doc-endnotes'],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'listitem']]
  };
  var _default$r = docEndnoteRole;
  docEndnoteRole$1.default = _default$r;

  var docEndnotesRole$1 = {};

  Object.defineProperty(docEndnotesRole$1, "__esModule", {
    value: true
  });
  docEndnotesRole$1.default = void 0;
  var docEndnotesRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'rearnotes [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['doc-endnote']],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$q = docEndnotesRole;
  docEndnotesRole$1.default = _default$q;

  var docEpigraphRole$1 = {};

  Object.defineProperty(docEpigraphRole$1, "__esModule", {
    value: true
  });
  docEpigraphRole$1.default = void 0;
  var docEpigraphRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'epigraph [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$p = docEpigraphRole;
  docEpigraphRole$1.default = _default$p;

  var docEpilogueRole$1 = {};

  Object.defineProperty(docEpilogueRole$1, "__esModule", {
    value: true
  });
  docEpilogueRole$1.default = void 0;
  var docEpilogueRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'epilogue [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$o = docEpilogueRole;
  docEpilogueRole$1.default = _default$o;

  var docErrataRole$1 = {};

  Object.defineProperty(docErrataRole$1, "__esModule", {
    value: true
  });
  docErrataRole$1.default = void 0;
  var docErrataRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'errata [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$n = docErrataRole;
  docErrataRole$1.default = _default$n;

  var docExampleRole$1 = {};

  Object.defineProperty(docExampleRole$1, "__esModule", {
    value: true
  });
  docExampleRole$1.default = void 0;
  var docExampleRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$m = docExampleRole;
  docExampleRole$1.default = _default$m;

  var docFootnoteRole$1 = {};

  Object.defineProperty(docFootnoteRole$1, "__esModule", {
    value: true
  });
  docFootnoteRole$1.default = void 0;
  var docFootnoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'footnote [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$l = docFootnoteRole;
  docFootnoteRole$1.default = _default$l;

  var docForewordRole$1 = {};

  Object.defineProperty(docForewordRole$1, "__esModule", {
    value: true
  });
  docForewordRole$1.default = void 0;
  var docForewordRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'foreword [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$k = docForewordRole;
  docForewordRole$1.default = _default$k;

  var docGlossaryRole$1 = {};

  Object.defineProperty(docGlossaryRole$1, "__esModule", {
    value: true
  });
  docGlossaryRole$1.default = void 0;
  var docGlossaryRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'glossary [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [['definition'], ['term']],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$j = docGlossaryRole;
  docGlossaryRole$1.default = _default$j;

  var docGlossrefRole$1 = {};

  Object.defineProperty(docGlossrefRole$1, "__esModule", {
    value: true
  });
  docGlossrefRole$1.default = void 0;
  var docGlossrefRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'glossref [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'command', 'link']]
  };
  var _default$i = docGlossrefRole;
  docGlossrefRole$1.default = _default$i;

  var docIndexRole$1 = {};

  Object.defineProperty(docIndexRole$1, "__esModule", {
    value: true
  });
  docIndexRole$1.default = void 0;
  var docIndexRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'index [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark', 'navigation']]
  };
  var _default$h = docIndexRole;
  docIndexRole$1.default = _default$h;

  var docIntroductionRole$1 = {};

  Object.defineProperty(docIntroductionRole$1, "__esModule", {
    value: true
  });
  docIntroductionRole$1.default = void 0;
  var docIntroductionRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'introduction [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$g = docIntroductionRole;
  docIntroductionRole$1.default = _default$g;

  var docNoterefRole$1 = {};

  Object.defineProperty(docNoterefRole$1, "__esModule", {
    value: true
  });
  docNoterefRole$1.default = void 0;
  var docNoterefRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author', 'contents'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'noteref [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'widget', 'command', 'link']]
  };
  var _default$f = docNoterefRole;
  docNoterefRole$1.default = _default$f;

  var docNoticeRole$1 = {};

  Object.defineProperty(docNoticeRole$1, "__esModule", {
    value: true
  });
  docNoticeRole$1.default = void 0;
  var docNoticeRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'notice [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'note']]
  };
  var _default$e = docNoticeRole;
  docNoticeRole$1.default = _default$e;

  var docPagebreakRole$1 = {};

  Object.defineProperty(docPagebreakRole$1, "__esModule", {
    value: true
  });
  docPagebreakRole$1.default = void 0;
  var docPagebreakRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: true,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'pagebreak [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'separator']]
  };
  var _default$d = docPagebreakRole;
  docPagebreakRole$1.default = _default$d;

  var docPagelistRole$1 = {};

  Object.defineProperty(docPagelistRole$1, "__esModule", {
    value: true
  });
  docPagelistRole$1.default = void 0;
  var docPagelistRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'page-list [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark', 'navigation']]
  };
  var _default$c = docPagelistRole;
  docPagelistRole$1.default = _default$c;

  var docPartRole$1 = {};

  Object.defineProperty(docPartRole$1, "__esModule", {
    value: true
  });
  docPartRole$1.default = void 0;
  var docPartRole = {
    abstract: false,
    accessibleNameRequired: true,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'part [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$b = docPartRole;
  docPartRole$1.default = _default$b;

  var docPrefaceRole$1 = {};

  Object.defineProperty(docPrefaceRole$1, "__esModule", {
    value: true
  });
  docPrefaceRole$1.default = void 0;
  var docPrefaceRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'preface [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$a = docPrefaceRole;
  docPrefaceRole$1.default = _default$a;

  var docPrologueRole$1 = {};

  Object.defineProperty(docPrologueRole$1, "__esModule", {
    value: true
  });
  docPrologueRole$1.default = void 0;
  var docPrologueRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'prologue [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark']]
  };
  var _default$9 = docPrologueRole;
  docPrologueRole$1.default = _default$9;

  var docPullquoteRole$1 = {};

  Object.defineProperty(docPullquoteRole$1, "__esModule", {
    value: true
  });
  docPullquoteRole$1.default = void 0;
  var docPullquoteRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {},
    relatedConcepts: [{
      concept: {
        name: 'pullquote [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['none']]
  };
  var _default$8 = docPullquoteRole;
  docPullquoteRole$1.default = _default$8;

  var docQnaRole$1 = {};

  Object.defineProperty(docQnaRole$1, "__esModule", {
    value: true
  });
  docQnaRole$1.default = void 0;
  var docQnaRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'qna [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section']]
  };
  var _default$7 = docQnaRole;
  docQnaRole$1.default = _default$7;

  var docSubtitleRole$1 = {};

  Object.defineProperty(docSubtitleRole$1, "__esModule", {
    value: true
  });
  docSubtitleRole$1.default = void 0;
  var docSubtitleRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'subtitle [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'sectionhead']]
  };
  var _default$6 = docSubtitleRole;
  docSubtitleRole$1.default = _default$6;

  var docTipRole$1 = {};

  Object.defineProperty(docTipRole$1, "__esModule", {
    value: true
  });
  docTipRole$1.default = void 0;
  var docTipRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'help [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'note']]
  };
  var _default$5 = docTipRole;
  docTipRole$1.default = _default$5;

  var docTocRole$1 = {};

  Object.defineProperty(docTocRole$1, "__esModule", {
    value: true
  });
  docTocRole$1.default = void 0;
  var docTocRole = {
    abstract: false,
    accessibleNameRequired: false,
    baseConcepts: [],
    childrenPresentational: false,
    nameFrom: ['author'],
    prohibitedProps: [],
    props: {
      'aria-disabled': null,
      'aria-errormessage': null,
      'aria-expanded': null,
      'aria-haspopup': null,
      'aria-invalid': null
    },
    relatedConcepts: [{
      concept: {
        name: 'toc [EPUB-SSV]'
      },
      module: 'EPUB'
    }],
    requireContextRole: [],
    requiredContextRole: [],
    requiredOwnedElements: [],
    requiredProps: {},
    superClass: [['roletype', 'structure', 'section', 'landmark', 'navigation']]
  };
  var _default$4 = docTocRole;
  docTocRole$1.default = _default$4;

  Object.defineProperty(ariaDpubRoles$1, "__esModule", {
    value: true
  });
  ariaDpubRoles$1.default = void 0;

  var _docAbstractRole = _interopRequireDefault$4(docAbstractRole$1);

  var _docAcknowledgmentsRole = _interopRequireDefault$4(docAcknowledgmentsRole$1);

  var _docAfterwordRole = _interopRequireDefault$4(docAfterwordRole$1);

  var _docAppendixRole = _interopRequireDefault$4(docAppendixRole$1);

  var _docBacklinkRole = _interopRequireDefault$4(docBacklinkRole$1);

  var _docBiblioentryRole = _interopRequireDefault$4(docBiblioentryRole$1);

  var _docBibliographyRole = _interopRequireDefault$4(docBibliographyRole$1);

  var _docBibliorefRole = _interopRequireDefault$4(docBibliorefRole$1);

  var _docChapterRole = _interopRequireDefault$4(docChapterRole$1);

  var _docColophonRole = _interopRequireDefault$4(docColophonRole$1);

  var _docConclusionRole = _interopRequireDefault$4(docConclusionRole$1);

  var _docCoverRole = _interopRequireDefault$4(docCoverRole$1);

  var _docCreditRole = _interopRequireDefault$4(docCreditRole$1);

  var _docCreditsRole = _interopRequireDefault$4(docCreditsRole$1);

  var _docDedicationRole = _interopRequireDefault$4(docDedicationRole$1);

  var _docEndnoteRole = _interopRequireDefault$4(docEndnoteRole$1);

  var _docEndnotesRole = _interopRequireDefault$4(docEndnotesRole$1);

  var _docEpigraphRole = _interopRequireDefault$4(docEpigraphRole$1);

  var _docEpilogueRole = _interopRequireDefault$4(docEpilogueRole$1);

  var _docErrataRole = _interopRequireDefault$4(docErrataRole$1);

  var _docExampleRole = _interopRequireDefault$4(docExampleRole$1);

  var _docFootnoteRole = _interopRequireDefault$4(docFootnoteRole$1);

  var _docForewordRole = _interopRequireDefault$4(docForewordRole$1);

  var _docGlossaryRole = _interopRequireDefault$4(docGlossaryRole$1);

  var _docGlossrefRole = _interopRequireDefault$4(docGlossrefRole$1);

  var _docIndexRole = _interopRequireDefault$4(docIndexRole$1);

  var _docIntroductionRole = _interopRequireDefault$4(docIntroductionRole$1);

  var _docNoterefRole = _interopRequireDefault$4(docNoterefRole$1);

  var _docNoticeRole = _interopRequireDefault$4(docNoticeRole$1);

  var _docPagebreakRole = _interopRequireDefault$4(docPagebreakRole$1);

  var _docPagelistRole = _interopRequireDefault$4(docPagelistRole$1);

  var _docPartRole = _interopRequireDefault$4(docPartRole$1);

  var _docPrefaceRole = _interopRequireDefault$4(docPrefaceRole$1);

  var _docPrologueRole = _interopRequireDefault$4(docPrologueRole$1);

  var _docPullquoteRole = _interopRequireDefault$4(docPullquoteRole$1);

  var _docQnaRole = _interopRequireDefault$4(docQnaRole$1);

  var _docSubtitleRole = _interopRequireDefault$4(docSubtitleRole$1);

  var _docTipRole = _interopRequireDefault$4(docTipRole$1);

  var _docTocRole = _interopRequireDefault$4(docTocRole$1);

  function _interopRequireDefault$4(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var ariaDpubRoles = [['doc-abstract', _docAbstractRole.default], ['doc-acknowledgments', _docAcknowledgmentsRole.default], ['doc-afterword', _docAfterwordRole.default], ['doc-appendix', _docAppendixRole.default], ['doc-backlink', _docBacklinkRole.default], ['doc-biblioentry', _docBiblioentryRole.default], ['doc-bibliography', _docBibliographyRole.default], ['doc-biblioref', _docBibliorefRole.default], ['doc-chapter', _docChapterRole.default], ['doc-colophon', _docColophonRole.default], ['doc-conclusion', _docConclusionRole.default], ['doc-cover', _docCoverRole.default], ['doc-credit', _docCreditRole.default], ['doc-credits', _docCreditsRole.default], ['doc-dedication', _docDedicationRole.default], ['doc-endnote', _docEndnoteRole.default], ['doc-endnotes', _docEndnotesRole.default], ['doc-epigraph', _docEpigraphRole.default], ['doc-epilogue', _docEpilogueRole.default], ['doc-errata', _docErrataRole.default], ['doc-example', _docExampleRole.default], ['doc-footnote', _docFootnoteRole.default], ['doc-foreword', _docForewordRole.default], ['doc-glossary', _docGlossaryRole.default], ['doc-glossref', _docGlossrefRole.default], ['doc-index', _docIndexRole.default], ['doc-introduction', _docIntroductionRole.default], ['doc-noteref', _docNoterefRole.default], ['doc-notice', _docNoticeRole.default], ['doc-pagebreak', _docPagebreakRole.default], ['doc-pagelist', _docPagelistRole.default], ['doc-part', _docPartRole.default], ['doc-preface', _docPrefaceRole.default], ['doc-prologue', _docPrologueRole.default], ['doc-pullquote', _docPullquoteRole.default], ['doc-qna', _docQnaRole.default], ['doc-subtitle', _docSubtitleRole.default], ['doc-tip', _docTipRole.default], ['doc-toc', _docTocRole.default]];
  var _default$3 = ariaDpubRoles;
  ariaDpubRoles$1.default = _default$3;

  Object.defineProperty(rolesMap$1, "__esModule", {
    value: true
  });
  rolesMap$1.default = void 0;

  var _ariaAbstractRoles = _interopRequireDefault$3(ariaAbstractRoles$1);

  var _ariaLiteralRoles = _interopRequireDefault$3(ariaLiteralRoles$1);

  var _ariaDpubRoles = _interopRequireDefault$3(ariaDpubRoles$1);

  function _interopRequireDefault$3(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e2) {
            throw _e2;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = it.call(o);
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e3) {
        didErr = true;
        err = _e3;
      },
      f: function f() {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _slicedToArray$2(arr, i) {
    return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest$2();
  }

  function _nonIterableRest$2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray$3(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$3(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen);
  }

  function _arrayLikeToArray$3(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _iterableToArrayLimit$2(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$2(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var roles$1 = [].concat(_ariaAbstractRoles.default, _ariaLiteralRoles.default, _ariaDpubRoles.default);
  roles$1.forEach(function (_ref) {
    var _ref2 = _slicedToArray$2(_ref, 2),
        roleDefinition = _ref2[1]; // Conglomerate the properties


    var _iterator = _createForOfIteratorHelper(roleDefinition.superClass),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var superClassIter = _step.value;

        var _iterator2 = _createForOfIteratorHelper(superClassIter),
            _step2;

        try {
          var _loop = function _loop() {
            var superClassName = _step2.value;
            var superClassRoleTuple = roles$1.find(function (_ref3) {
              var _ref4 = _slicedToArray$2(_ref3, 1),
                  name = _ref4[0];

              return name === superClassName;
            });

            if (superClassRoleTuple) {
              var superClassDefinition = superClassRoleTuple[1];

              for (var _i2 = 0, _Object$keys = Object.keys(superClassDefinition.props); _i2 < _Object$keys.length; _i2++) {
                var prop = _Object$keys[_i2];

                if ( // $FlowIssue Accessing the hasOwnProperty on the Object prototype is fine.
                !Object.prototype.hasOwnProperty.call(roleDefinition.props, prop)) {
                  Object.assign(roleDefinition.props, _defineProperty({}, prop, superClassDefinition.props[prop]));
                }
              }
            }
          };

          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  var rolesMap = {
    entries: function entries() {
      return roles$1;
    },
    get: function get(key) {
      var item = roles$1.find(function (tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return roles$1.map(function (_ref5) {
        var _ref6 = _slicedToArray$2(_ref5, 1),
            key = _ref6[0];

        return key;
      });
    },
    values: function values() {
      return roles$1.map(function (_ref7) {
        var _ref8 = _slicedToArray$2(_ref7, 2),
            values = _ref8[1];

        return values;
      });
    }
  };
  var _default$2 = rolesMap;
  rolesMap$1.default = _default$2;

  var elementRoleMap$1 = {};

  Object.defineProperty(elementRoleMap$1, "__esModule", {
    value: true
  });
  elementRoleMap$1.default = void 0;

  var _rolesMap$2 = _interopRequireDefault$2(rolesMap$1);

  function _interopRequireDefault$2(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$1();
  }

  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray$2(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
  }

  function _arrayLikeToArray$2(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _iterableToArrayLimit$1(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var elementRoles$1 = [];

  var keys$1 = _rolesMap$2.default.keys();

  for (var i$1 = 0; i$1 < keys$1.length; i$1++) {
    var _key = keys$1[i$1];

    var role = _rolesMap$2.default.get(_key);

    if (role) {
      var concepts = [].concat(role.baseConcepts, role.relatedConcepts);

      for (var k = 0; k < concepts.length; k++) {
        var relation = concepts[k];

        if (relation.module === 'HTML') {
          var concept = relation.concept;

          if (concept) {
            (function () {
              var conceptStr = JSON.stringify(concept);
              var elementRoleRelation = elementRoles$1.find(function (relation) {
                return JSON.stringify(relation[0]) === conceptStr;
              });
              var roles = void 0;

              if (elementRoleRelation) {
                roles = elementRoleRelation[1];
              } else {
                roles = [];
              }

              var isUnique = true;

              for (var _i = 0; _i < roles.length; _i++) {
                if (roles[_i] === _key) {
                  isUnique = false;
                  break;
                }
              }

              if (isUnique) {
                roles.push(_key);
              }

              elementRoles$1.push([concept, roles]);
            })();
          }
        }
      }
    }
  }

  var elementRoleMap = {
    entries: function entries() {
      return elementRoles$1;
    },
    get: function get(key) {
      var item = elementRoles$1.find(function (tuple) {
        return JSON.stringify(tuple[0]) === JSON.stringify(key) ? true : false;
      });
      return item && item[1];
    },
    has: function has(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return elementRoles$1.map(function (_ref) {
        var _ref2 = _slicedToArray$1(_ref, 1),
            key = _ref2[0];

        return key;
      });
    },
    values: function values() {
      return elementRoles$1.map(function (_ref3) {
        var _ref4 = _slicedToArray$1(_ref3, 2),
            values = _ref4[1];

        return values;
      });
    }
  };
  var _default$1 = elementRoleMap;
  elementRoleMap$1.default = _default$1;

  var roleElementMap$1 = {};

  Object.defineProperty(roleElementMap$1, "__esModule", {
    value: true
  });
  roleElementMap$1.default = void 0;

  var _rolesMap$1 = _interopRequireDefault$1(rolesMap$1);

  function _interopRequireDefault$1(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }

  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var roleElement = [];

  var keys = _rolesMap$1.default.keys();

  var _loop = function _loop(i) {
    var key = keys[i];

    var role = _rolesMap$1.default.get(key);

    if (role) {
      var concepts = [].concat(role.baseConcepts, role.relatedConcepts);

      for (var k = 0; k < concepts.length; k++) {
        var relation = concepts[k];

        if (relation.module === 'HTML') {
          var concept = relation.concept;

          if (concept) {
            var roleElementRelation = roleElement.find(function (item) {
              return item[0] === key;
            });
            var relationConcepts = void 0;

            if (roleElementRelation) {
              relationConcepts = roleElementRelation[1];
            } else {
              relationConcepts = [];
            }

            relationConcepts.push(concept);
            roleElement.push([key, relationConcepts]);
          }
        }
      }
    }
  };

  for (var i = 0; i < keys.length; i++) {
    _loop(i);
  }

  var roleElementMap = {
    entries: function entries() {
      return roleElement;
    },
    get: function get(key) {
      var item = roleElement.find(function (tuple) {
        return tuple[0] === key ? true : false;
      });
      return item && item[1];
    },
    has: function has(key) {
      return !!this.get(key);
    },
    keys: function keys() {
      return roleElement.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            key = _ref2[0];

        return key;
      });
    },
    values: function values() {
      return roleElement.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            values = _ref4[1];

        return values;
      });
    }
  };
  var _default = roleElementMap;
  roleElementMap$1.default = _default;

  Object.defineProperty(lib, "__esModule", {
    value: true
  });
  var roleElements_1 = lib.roleElements = elementRoles_1 = lib.elementRoles = roles_1 = lib.roles = lib.dom = lib.aria = void 0;

  var _ariaPropsMap = _interopRequireDefault(ariaPropsMap$1);

  var _domMap = _interopRequireDefault(domMap$1);

  var _rolesMap = _interopRequireDefault(rolesMap$1);

  var _elementRoleMap = _interopRequireDefault(elementRoleMap$1);

  var _roleElementMap = _interopRequireDefault(roleElementMap$1);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var aria = _ariaPropsMap.default;
  lib.aria = aria;
  var dom = _domMap.default;
  lib.dom = dom;
  var roles = _rolesMap.default;
  var roles_1 = lib.roles = roles;
  var elementRoles = _elementRoleMap.default;
  var elementRoles_1 = lib.elementRoles = elementRoles;
  var roleElements = _roleElementMap.default;
  roleElements_1 = lib.roleElements = roleElements;

  var lzString = {exports: {}};

  (function (module) {
    // Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
    // This work is free. You can redistribute it and/or modify it
    // under the terms of the WTFPL, Version 2
    // For more information see LICENSE.txt or http://www.wtfpl.net/
    //
    // For more information, the home page:
    // http://pieroxy.net/blog/pages/lz-string/testing.html
    //
    // LZ-based compression algorithm, version 1.4.4
    var LZString = function () {
      // private property
      var f = String.fromCharCode;
      var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
      var baseReverseDic = {};

      function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
          baseReverseDic[alphabet] = {};

          for (var i = 0; i < alphabet.length; i++) {
            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
          }
        }

        return baseReverseDic[alphabet][character];
      }

      var LZString = {
        compressToBase64: function compressToBase64(input) {
          if (input == null) return "";

          var res = LZString._compress(input, 6, function (a) {
            return keyStrBase64.charAt(a);
          });

          switch (res.length % 4) {
            // To produce valid Base64
            default: // When could this happen ?

            case 0:
              return res;

            case 1:
              return res + "===";

            case 2:
              return res + "==";

            case 3:
              return res + "=";
          }
        },
        decompressFromBase64: function decompressFromBase64(input) {
          if (input == null) return "";
          if (input == "") return null;
          return LZString._decompress(input.length, 32, function (index) {
            return getBaseValue(keyStrBase64, input.charAt(index));
          });
        },
        compressToUTF16: function compressToUTF16(input) {
          if (input == null) return "";
          return LZString._compress(input, 15, function (a) {
            return f(a + 32);
          }) + " ";
        },
        decompressFromUTF16: function decompressFromUTF16(compressed) {
          if (compressed == null) return "";
          if (compressed == "") return null;
          return LZString._decompress(compressed.length, 16384, function (index) {
            return compressed.charCodeAt(index) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function compressToUint8Array(uncompressed) {
          var compressed = LZString.compress(uncompressed);
          var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

          for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
            var current_value = compressed.charCodeAt(i);
            buf[i * 2] = current_value >>> 8;
            buf[i * 2 + 1] = current_value % 256;
          }

          return buf;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function decompressFromUint8Array(compressed) {
          if (compressed === null || compressed === undefined) {
            return LZString.decompress(compressed);
          } else {
            var buf = new Array(compressed.length / 2); // 2 bytes per character

            for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
              buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
            }

            var result = [];
            buf.forEach(function (c) {
              result.push(f(c));
            });
            return LZString.decompress(result.join(''));
          }
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function compressToEncodedURIComponent(input) {
          if (input == null) return "";
          return LZString._compress(input, 6, function (a) {
            return keyStrUriSafe.charAt(a);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function decompressFromEncodedURIComponent(input) {
          if (input == null) return "";
          if (input == "") return null;
          input = input.replace(/ /g, "+");
          return LZString._decompress(input.length, 32, function (index) {
            return getBaseValue(keyStrUriSafe, input.charAt(index));
          });
        },
        compress: function compress(uncompressed) {
          return LZString._compress(uncompressed, 16, function (a) {
            return f(a);
          });
        },
        _compress: function _compress(uncompressed, bitsPerChar, getCharFromInt) {
          if (uncompressed == null) return "";
          var i,
              value,
              context_dictionary = {},
              context_dictionaryToCreate = {},
              context_c = "",
              context_wc = "",
              context_w = "",
              context_enlargeIn = 2,
              // Compensate for the first entry which should not count
          context_dictSize = 3,
              context_numBits = 2,
              context_data = [],
              context_data_val = 0,
              context_data_position = 0,
              ii;

          for (ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);

            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
              context_dictionary[context_c] = context_dictSize++;
              context_dictionaryToCreate[context_c] = true;
            }

            context_wc = context_w + context_c;

            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
              context_w = context_wc;
            } else {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;

                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                  }

                  value = context_w.charCodeAt(0);

                  for (i = 0; i < 8; i++) {
                    context_data_val = context_data_val << 1 | value & 1;

                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }

                    value = value >> 1;
                  }
                } else {
                  value = 1;

                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value;

                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }

                    value = 0;
                  }

                  value = context_w.charCodeAt(0);

                  for (i = 0; i < 16; i++) {
                    context_data_val = context_data_val << 1 | value & 1;

                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }

                    value = value >> 1;
                  }
                }

                context_enlargeIn--;

                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }

                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];

                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value & 1;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }

                  value = value >> 1;
                }
              }

              context_enlargeIn--;

              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              } // Add wc to the dictionary.


              context_dictionary[context_wc] = context_dictSize++;
              context_w = String(context_c);
            }
          } // Output the code for w.


          if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }

                value = context_w.charCodeAt(0);

                for (i = 0; i < 8; i++) {
                  context_data_val = context_data_val << 1 | value & 1;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }

                  value = value >> 1;
                }
              } else {
                value = 1;

                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }

                  value = 0;
                }

                value = context_w.charCodeAt(0);

                for (i = 0; i < 16; i++) {
                  context_data_val = context_data_val << 1 | value & 1;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }

                  value = value >> 1;
                }
              }

              context_enlargeIn--;

              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }

              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];

              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value & 1;

                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }

                value = value >> 1;
              }
            }

            context_enlargeIn--;

            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
          } // Mark the end of the stream


          value = 2;

          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value & 1;

            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = value >> 1;
          } // Flush the last char


          while (true) {
            context_data_val = context_data_val << 1;

            if (context_data_position == bitsPerChar - 1) {
              context_data.push(getCharFromInt(context_data_val));
              break;
            } else context_data_position++;
          }

          return context_data.join('');
        },
        decompress: function decompress(compressed) {
          if (compressed == null) return "";
          if (compressed == "") return null;
          return LZString._decompress(compressed.length, 32768, function (index) {
            return compressed.charCodeAt(index);
          });
        },
        _decompress: function _decompress(length, resetValue, getNextValue) {
          var dictionary = [],
              enlargeIn = 4,
              dictSize = 4,
              numBits = 3,
              entry = "",
              result = [],
              i,
              w,
              bits,
              resb,
              maxpower,
              power,
              c,
              data = {
            val: getNextValue(0),
            position: resetValue,
            index: 1
          };

          for (i = 0; i < 3; i += 1) {
            dictionary[i] = i;
          }

          bits = 0;
          maxpower = Math.pow(2, 2);
          power = 1;

          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;

            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }

            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          switch (bits) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;

              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;

                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }

                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }

              c = f(bits);
              break;

            case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;

              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;

                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }

                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }

              c = f(bits);
              break;

            case 2:
              return "";
          }

          dictionary[3] = c;
          w = c;
          result.push(c);

          while (true) {
            if (data.index > length) {
              return "";
            }

            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;

            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;

              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }

              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }

            switch (c = bits) {
              case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;

                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;

                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }

                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }

                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;

              case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;

                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;

                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }

                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }

                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;

              case 2:
                return result.join('');
            }

            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }

            if (dictionary[c]) {
              entry = dictionary[c];
            } else {
              if (c === dictSize) {
                entry = w + w.charAt(0);
              } else {
                return null;
              }
            }

            result.push(entry); // Add w+entry[0] to the dictionary.

            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;

            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
          }
        }
      };
      return LZString;
    }();

    if (module != null) {
      module.exports = LZString;
    }
  })(lzString);

  /**
   * Source: https://github.com/facebook/jest/blob/e7bb6a1e26ffab90611b2593912df15b69315611/packages/pretty-format/src/plugins/DOMElement.ts
   */

  /* eslint-disable -- trying to stay as close to the original as possible */

  /* istanbul ignore file */

  function escapeHTML(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  } // Return empty string if keys is empty.


  var printProps = function printProps(keys, props, config, indentation, depth, refs, printer) {
    var indentationNext = indentation + config.indent;
    var colors = config.colors;
    return keys.map(function (key) {
      var value = props[key];
      var printed = printer(value, config, indentationNext, depth, refs);

      if (typeof value !== 'string') {
        if (printed.indexOf('\n') !== -1) {
          printed = config.spacingOuter + indentationNext + printed + config.spacingOuter + indentation;
        }

        printed = '{' + printed + '}';
      }

      return config.spacingInner + indentation + colors.prop.open + key + colors.prop.close + '=' + colors.value.open + printed + colors.value.close;
    }).join('');
  }; // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#node_type_constants


  var NodeTypeTextNode = 3; // Return empty string if children is empty.

  var printChildren = function printChildren(children, config, indentation, depth, refs, printer) {
    return children.map(function (child) {
      var printedChild = typeof child === 'string' ? printText(child, config) : printer(child, config, indentation, depth, refs);

      if (printedChild === '' && typeof child === 'object' && child !== null && child.nodeType !== NodeTypeTextNode) {
        // A plugin serialized this Node to '' meaning we should ignore it.
        return '';
      }

      return config.spacingOuter + indentation + printedChild;
    }).join('');
  };

  var printText = function printText(text, config) {
    var contentColor = config.colors.content;
    return contentColor.open + escapeHTML(text) + contentColor.close;
  };

  var printComment = function printComment(comment, config) {
    var commentColor = config.colors.comment;
    return commentColor.open + '<!--' + escapeHTML(comment) + '-->' + commentColor.close;
  }; // Separate the functions to format props, children, and element,
  // so a plugin could override a particular function, if needed.
  // Too bad, so sad: the traditional (but unnecessary) space
  // in a self-closing tagColor requires a second test of printedProps.


  var printElement = function printElement(type, printedProps, printedChildren, config, indentation) {
    var tagColor = config.colors.tag;
    return tagColor.open + '<' + type + (printedProps && tagColor.close + printedProps + config.spacingOuter + indentation + tagColor.open) + (printedChildren ? '>' + tagColor.close + printedChildren + config.spacingOuter + indentation + tagColor.open + '</' + type : (printedProps && !config.min ? '' : ' ') + '/') + '>' + tagColor.close;
  };

  var printElementAsLeaf = function printElementAsLeaf(type, config) {
    var tagColor = config.colors.tag;
    return tagColor.open + '<' + type + tagColor.close + ' …' + tagColor.open + ' />' + tagColor.close;
  };

  var ELEMENT_NODE$1 = 1;
  var TEXT_NODE$1 = 3;
  var COMMENT_NODE$1 = 8;
  var FRAGMENT_NODE = 11;
  var ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;

  var testNode = function testNode(val) {
    var constructorName = val.constructor.name;
    var nodeType = val.nodeType,
        tagName = val.tagName;
    var isCustomElement = typeof tagName === 'string' && tagName.includes('-') || typeof val.hasAttribute === 'function' && val.hasAttribute('is');
    return nodeType === ELEMENT_NODE$1 && (ELEMENT_REGEXP.test(constructorName) || isCustomElement) || nodeType === TEXT_NODE$1 && constructorName === 'Text' || nodeType === COMMENT_NODE$1 && constructorName === 'Comment' || nodeType === FRAGMENT_NODE && constructorName === 'DocumentFragment';
  };

  function nodeIsText(node) {
    return node.nodeType === TEXT_NODE$1;
  }

  function nodeIsComment(node) {
    return node.nodeType === COMMENT_NODE$1;
  }

  function nodeIsFragment(node) {
    return node.nodeType === FRAGMENT_NODE;
  }

  function createDOMElementFilter(filterNode) {
    return {
      test: function test(val) {
        var _val$constructor2;

        return (val == null ? void 0 : (_val$constructor2 = val.constructor) == null ? void 0 : _val$constructor2.name) && testNode(val);
      },
      serialize: function serialize(node, config, indentation, depth, refs, printer) {
        if (nodeIsText(node)) {
          return printText(node.data, config);
        }

        if (nodeIsComment(node)) {
          return printComment(node.data, config);
        }

        var type = nodeIsFragment(node) ? "DocumentFragment" : node.tagName.toLowerCase();

        if (++depth > config.maxDepth) {
          return printElementAsLeaf(type, config);
        }

        return printElement(type, printProps(nodeIsFragment(node) ? [] : Array.from(node.attributes).map(function (attr) {
          return attr.name;
        }).sort(), nodeIsFragment(node) ? {} : Array.from(node.attributes).reduce(function (props, attribute) {
          props[attribute.name] = attribute.value;
          return props;
        }, {}), config, indentation + config.indent, depth, refs, printer), printChildren(Array.prototype.slice.call(node.childNodes || node.children).filter(filterNode), config, indentation + config.indent, depth, refs, printer), config, indentation);
      }
    };
  } // We try to load node dependencies


  var chalk = null;
  var readFileSync = null;
  var codeFrameColumns = null;

  try {
    var nodeRequire = module && module.require;
    readFileSync = nodeRequire.call(module, 'fs').readFileSync;
    codeFrameColumns = nodeRequire.call(module, '@babel/code-frame').codeFrameColumns;
    chalk = nodeRequire.call(module, 'chalk');
  } catch (_unused) {// We're in a browser environment
  } // frame has the form "at myMethod (location/to/my/file.js:10:2)"


  function getCodeFrame(frame) {
    var locationStart = frame.indexOf('(') + 1;
    var locationEnd = frame.indexOf(')');
    var frameLocation = frame.slice(locationStart, locationEnd);
    var frameLocationElements = frameLocation.split(':');
    var _ref = [frameLocationElements[0], parseInt(frameLocationElements[1], 10), parseInt(frameLocationElements[2], 10)],
        filename = _ref[0],
        line = _ref[1],
        column = _ref[2];
    var rawFileContents = '';

    try {
      rawFileContents = readFileSync(filename, 'utf-8');
    } catch (_unused2) {
      return '';
    }

    var codeFrame = codeFrameColumns(rawFileContents, {
      start: {
        line: line,
        column: column
      }
    }, {
      highlightCode: true,
      linesBelow: 0
    });
    return chalk.dim(frameLocation) + "\n" + codeFrame + "\n";
  }

  function getUserCodeFrame() {
    // If we couldn't load dependencies, we can't generate the user trace

    /* istanbul ignore next */
    if (!readFileSync || !codeFrameColumns) {
      return '';
    }

    var err = new Error();
    var firstClientCodeFrame = err.stack.split('\n').slice(1) // Remove first line which has the form "Error: TypeError"
    .find(function (frame) {
      return !frame.includes('node_modules/');
    }); // Ignore frames from 3rd party libraries

    return getCodeFrame(firstClientCodeFrame);
  } // Constant node.nodeType for text nodes, see:
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#Node_type_constants


  var TEXT_NODE = 3;

  function jestFakeTimersAreEnabled() {
    /* istanbul ignore else */
    if (typeof jest !== 'undefined' && jest !== null) {
      return (// legacy timers
        setTimeout._isMockFunction === true || // modern timers
        Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
      );
    } // istanbul ignore next


    return false;
  }

  function getDocument() {
    /* istanbul ignore if */
    if (typeof window === 'undefined') {
      throw new Error('Could not find default container');
    }

    return window.document;
  }

  function getWindowFromNode(node) {
    if (node.defaultView) {
      // node is document
      return node.defaultView;
    } else if (node.ownerDocument && node.ownerDocument.defaultView) {
      // node is a DOM node
      return node.ownerDocument.defaultView;
    } else if (node.window) {
      // node is window
      return node.window;
    } else if (node.ownerDocument && node.ownerDocument.defaultView === null) {
      throw new Error("It looks like the window object is not available for the provided node.");
    } else if (node.then instanceof Function) {
      throw new Error("It looks like you passed a Promise object instead of a DOM node. Did you do something like `fireEvent.click(screen.findBy...` when you meant to use a `getBy` query `fireEvent.click(screen.getBy...`, or await the findBy query `fireEvent.click(await screen.findBy...`?");
    } else if (Array.isArray(node)) {
      throw new Error("It looks like you passed an Array instead of a DOM node. Did you do something like `fireEvent.click(screen.getAllBy...` when you meant to use a `getBy` query `fireEvent.click(screen.getBy...`?");
    } else if (typeof node.debug === 'function' && typeof node.logTestingPlaygroundURL === 'function') {
      throw new Error("It looks like you passed a `screen` object. Did you do something like `fireEvent.click(screen, ...` when you meant to use a query, e.g. `fireEvent.click(screen.getBy..., `?");
    } else {
      // The user passed something unusual to a calling function
      throw new Error("The given node is not an Element, the node type is: " + typeof node + ".");
    }
  }

  function checkContainerType(container) {
    if (!container || !(typeof container.querySelector === 'function') || !(typeof container.querySelectorAll === 'function')) {
      throw new TypeError("Expected container to be an Element, a Document or a DocumentFragment but got " + getTypeName(container) + ".");
    }

    function getTypeName(object) {
      if (typeof object === 'object') {
        return object === null ? 'null' : object.constructor.name;
      }

      return typeof object;
    }
  }

  var DEFAULT_IGNORE_TAGS = 'script, style';
  var _excluded$1 = ["filterNode"];

  var inNode = function inNode() {
    return typeof process !== 'undefined' && process.versions !== undefined && process.versions.node !== undefined;
  };

  var DOMCollection = plugins_1.DOMCollection; // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#node_type_constants

  var ELEMENT_NODE = 1;
  var COMMENT_NODE = 8; // https://github.com/facebook/jest/blob/615084195ae1ae61ddd56162c62bbdda17587569/packages/pretty-format/src/plugins/DOMElement.ts#L50

  function filterCommentsAndDefaultIgnoreTagsTags(value) {
    return value.nodeType !== COMMENT_NODE && ( // value.nodeType === ELEMENT_NODE => !value.matches(DEFAULT_IGNORE_TAGS)
    value.nodeType !== ELEMENT_NODE || !value.matches(DEFAULT_IGNORE_TAGS));
  }

  function prettyDOM(dom, maxLength, options) {
    if (options === void 0) {
      options = {};
    }

    if (!dom) {
      dom = getDocument().body;
    }

    if (typeof maxLength !== 'number') {
      maxLength = typeof process !== 'undefined' && undefined || 7000;
    }

    if (maxLength === 0) {
      return '';
    }

    if (dom.documentElement) {
      dom = dom.documentElement;
    }

    var domTypeName = typeof dom;

    if (domTypeName === 'object') {
      domTypeName = dom.constructor.name;
    } else {
      // To don't fall with `in` operator
      dom = {};
    }

    if (!('outerHTML' in dom)) {
      throw new TypeError("Expected an element or document but got " + domTypeName);
    }

    var _options = options,
        _options$filterNode = _options.filterNode,
        filterNode = _options$filterNode === void 0 ? filterCommentsAndDefaultIgnoreTagsTags : _options$filterNode,
        prettyFormatOptions = _objectWithoutPropertiesLoose(_options, _excluded$1);

    var debugContent = format_1(dom, _extends({
      plugins: [createDOMElementFilter(filterNode), DOMCollection],
      printFunctionName: false,
      highlight: inNode()
    }, prettyFormatOptions));
    return maxLength !== undefined && dom.outerHTML.length > maxLength ? debugContent.slice(0, maxLength) + "..." : debugContent;
  }

  var logDOM = function logDOM() {
    var userCodeFrame = getUserCodeFrame();

    if (userCodeFrame) {
      console.log(prettyDOM.apply(void 0, arguments) + "\n\n" + userCodeFrame);
    } else {
      console.log(prettyDOM.apply(void 0, arguments));
    }
  }; // It would be cleaner for this to live inside './queries', but
  // other parts of the code assume that all exports from
  // './queries' are query functions.


  var config = {
    testIdAttribute: 'data-testid',
    asyncUtilTimeout: 1000,
    // asyncWrapper and advanceTimersWrapper is to support React's async `act` function.
    // forcing react-testing-library to wrap all async functions would've been
    // a total nightmare (consider wrapping every findBy* query and then also
    // updating `within` so those would be wrapped too. Total nightmare).
    // so we have this config option that's really only intended for
    // react-testing-library to use. For that reason, this feature will remain
    // undocumented.
    asyncWrapper: function asyncWrapper(cb) {
      return cb();
    },
    unstable_advanceTimersWrapper: function unstable_advanceTimersWrapper(cb) {
      return cb();
    },
    eventWrapper: function eventWrapper(cb) {
      return cb();
    },
    // default value for the `hidden` option in `ByRole` queries
    defaultHidden: false,
    // showOriginalStackTrace flag to show the full error stack traces for async errors
    showOriginalStackTrace: false,
    // throw errors w/ suggestions for better queries. Opt in so off by default.
    throwSuggestions: false,
    // called when getBy* queries fail. (message, container) => Error
    getElementError: function getElementError(message, container) {
      var prettifiedDOM = prettyDOM(container);
      var error = new Error([message, "Ignored nodes: comments, <script />, <style />\n" + prettifiedDOM].filter(Boolean).join('\n\n'));
      error.name = 'TestingLibraryElementError';
      return error;
    },
    _disableExpensiveErrorDiagnostics: false,
    computedStyleSupportsPseudoElements: false
  };

  function runWithExpensiveErrorDiagnosticsDisabled(callback) {
    try {
      config._disableExpensiveErrorDiagnostics = true;
      return callback();
    } finally {
      config._disableExpensiveErrorDiagnostics = false;
    }
  }

  function configure(newConfig) {
    if (typeof newConfig === 'function') {
      // Pass the existing config out to the provided function
      // and accept a delta in return
      newConfig = newConfig(config);
    } // Merge the incoming config delta


    config = _extends({}, config, newConfig);
  }

  function getConfig() {
    return config;
  }

  var labelledNodeNames = ['button', 'meter', 'output', 'progress', 'select', 'textarea', 'input'];

  function getTextContent(node) {
    if (labelledNodeNames.includes(node.nodeName.toLowerCase())) {
      return '';
    }

    if (node.nodeType === TEXT_NODE) return node.textContent;
    return Array.from(node.childNodes).map(function (childNode) {
      return getTextContent(childNode);
    }).join('');
  }

  function getLabelContent(element) {
    var textContent;

    if (element.tagName.toLowerCase() === 'label') {
      textContent = getTextContent(element);
    } else {
      textContent = element.value || element.textContent;
    }

    return textContent;
  } // Based on https://github.com/eps1lon/dom-accessibility-api/pull/352


  function getRealLabels(element) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- types are not aware of older browsers that don't implement `labels`
    if (element.labels !== undefined) {
      var _labels;

      return (_labels = element.labels) != null ? _labels : [];
    }

    if (!isLabelable(element)) return [];
    var labels = element.ownerDocument.querySelectorAll('label');
    return Array.from(labels).filter(function (label) {
      return label.control === element;
    });
  }

  function isLabelable(element) {
    return /BUTTON|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA/.test(element.tagName) || element.tagName === 'INPUT' && element.getAttribute('type') !== 'hidden';
  }

  function getLabels(container, element, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? '*' : _ref$selector;

    var ariaLabelledBy = element.getAttribute('aria-labelledby');
    var labelsId = ariaLabelledBy ? ariaLabelledBy.split(' ') : [];
    return labelsId.length ? labelsId.map(function (labelId) {
      var labellingElement = container.querySelector("[id=\"" + labelId + "\"]");
      return labellingElement ? {
        content: getLabelContent(labellingElement),
        formControl: null
      } : {
        content: '',
        formControl: null
      };
    }) : Array.from(getRealLabels(element)).map(function (label) {
      var textToMatch = getLabelContent(label);
      var formControlSelector = 'button, input, meter, output, progress, select, textarea';
      var labelledFormControl = Array.from(label.querySelectorAll(formControlSelector)).filter(function (formControlElement) {
        return formControlElement.matches(selector);
      })[0];
      return {
        content: textToMatch,
        formControl: labelledFormControl
      };
    });
  }

  function assertNotNullOrUndefined(matcher) {
    if (matcher === null || matcher === undefined) {
      throw new Error( // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- implicitly converting `T` to `string`
      "It looks like " + matcher + " was passed instead of a matcher. Did you do something like getByText(" + matcher + ")?");
    }
  }

  function fuzzyMatches(textToMatch, node, matcher, normalizer) {
    if (typeof textToMatch !== 'string') {
      return false;
    }

    assertNotNullOrUndefined(matcher);
    var normalizedText = normalizer(textToMatch);

    if (typeof matcher === 'string' || typeof matcher === 'number') {
      return normalizedText.toLowerCase().includes(matcher.toString().toLowerCase());
    } else if (typeof matcher === 'function') {
      return matcher(normalizedText, node);
    } else {
      return matcher.test(normalizedText);
    }
  }

  function matches(textToMatch, node, matcher, normalizer) {
    if (typeof textToMatch !== 'string') {
      return false;
    }

    assertNotNullOrUndefined(matcher);
    var normalizedText = normalizer(textToMatch);

    if (matcher instanceof Function) {
      return matcher(normalizedText, node);
    } else if (matcher instanceof RegExp) {
      return matcher.test(normalizedText);
    } else {
      return normalizedText === String(matcher);
    }
  }

  function getDefaultNormalizer(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$trim = _ref.trim,
        trim = _ref$trim === void 0 ? true : _ref$trim,
        _ref$collapseWhitespa = _ref.collapseWhitespace,
        collapseWhitespace = _ref$collapseWhitespa === void 0 ? true : _ref$collapseWhitespa;

    return function (text) {
      var normalizedText = text;
      normalizedText = trim ? normalizedText.trim() : normalizedText;
      normalizedText = collapseWhitespace ? normalizedText.replace(/\s+/g, ' ') : normalizedText;
      return normalizedText;
    };
  }
  /**
   * Constructs a normalizer to pass to functions in matches.js
   * @param {boolean|undefined} trim The user-specified value for `trim`, without
   * any defaulting having been applied
   * @param {boolean|undefined} collapseWhitespace The user-specified value for
   * `collapseWhitespace`, without any defaulting having been applied
   * @param {Function|undefined} normalizer The user-specified normalizer
   * @returns {Function} A normalizer
   */


  function makeNormalizer(_ref2) {
    var trim = _ref2.trim,
        collapseWhitespace = _ref2.collapseWhitespace,
        normalizer = _ref2.normalizer;

    if (normalizer) {
      // User has specified a custom normalizer
      if (typeof trim !== 'undefined' || typeof collapseWhitespace !== 'undefined') {
        // They've also specified a value for trim or collapseWhitespace
        throw new Error('trim and collapseWhitespace are not supported with a normalizer. ' + 'If you want to use the default trim and collapseWhitespace logic in your normalizer, ' + 'use "getDefaultNormalizer({trim, collapseWhitespace})" and compose that into your normalizer');
      }

      return normalizer;
    } else {
      // No custom normalizer specified. Just use default.
      return getDefaultNormalizer({
        trim: trim,
        collapseWhitespace: collapseWhitespace
      });
    }
  }

  function getNodeText(node) {
    if (node.matches('input[type=submit], input[type=button], input[type=reset]')) {
      return node.value;
    }

    return Array.from(node.childNodes).filter(function (child) {
      return child.nodeType === TEXT_NODE && Boolean(child.textContent);
    }).map(function (c) {
      return c.textContent;
    }).join('');
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);

    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var elementRoleList = buildElementRoleList(elementRoles_1);
  /**
   * @param {Element} element -
   * @returns {boolean} - `true` if `element` and its subtree are inaccessible
   */

  function isSubtreeInaccessible(element) {
    if (element.hidden === true) {
      return true;
    }

    if (element.getAttribute('aria-hidden') === 'true') {
      return true;
    }

    var window = element.ownerDocument.defaultView;

    if (window.getComputedStyle(element).display === 'none') {
      return true;
    }

    return false;
  }
  /**
   * Partial implementation https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
   * which should only be used for elements with a non-presentational role i.e.
   * `role="none"` and `role="presentation"` will not be excluded.
   *
   * Implements aria-hidden semantics (i.e. parent overrides child)
   * Ignores "Child Presentational: True" characteristics
   *
   * @param {Element} element -
   * @param {object} [options] -
   * @param {function (element: Element): boolean} options.isSubtreeInaccessible -
   * can be used to return cached results from previous isSubtreeInaccessible calls
   * @returns {boolean} true if excluded, otherwise false
   */


  function isInaccessible(element, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$isSubtreeIna = _options.isSubtreeInaccessible,
        isSubtreeInaccessibleImpl = _options$isSubtreeIna === void 0 ? isSubtreeInaccessible : _options$isSubtreeIna;
    var window = element.ownerDocument.defaultView; // since visibility is inherited we can exit early

    if (window.getComputedStyle(element).visibility === 'hidden') {
      return true;
    }

    var currentElement = element;

    while (currentElement) {
      if (isSubtreeInaccessibleImpl(currentElement)) {
        return true;
      }

      currentElement = currentElement.parentElement;
    }

    return false;
  }

  function getImplicitAriaRoles(currentNode) {
    // eslint bug here:
    // eslint-disable-next-line no-unused-vars
    for (var _iterator = _createForOfIteratorHelperLoose(elementRoleList), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          match = _step$value.match,
          roles = _step$value.roles;

      if (match(currentNode)) {
        return [].concat(roles);
      }
    }

    return [];
  }

  function buildElementRoleList(elementRolesMap) {
    function makeElementSelector(_ref) {
      var name = _ref.name,
          attributes = _ref.attributes;
      return "" + name + attributes.map(function (_ref2) {
        var attributeName = _ref2.name,
            value = _ref2.value,
            _ref2$constraints = _ref2.constraints,
            constraints = _ref2$constraints === void 0 ? [] : _ref2$constraints;
        var shouldNotExist = constraints.indexOf('undefined') !== -1;

        if (shouldNotExist) {
          return ":not([" + attributeName + "])";
        } else if (value) {
          return "[" + attributeName + "=\"" + value + "\"]";
        } else {
          return "[" + attributeName + "]";
        }
      }).join('');
    }

    function getSelectorSpecificity(_ref3) {
      var _ref3$attributes = _ref3.attributes,
          attributes = _ref3$attributes === void 0 ? [] : _ref3$attributes;
      return attributes.length;
    }

    function bySelectorSpecificity(_ref4, _ref5) {
      var leftSpecificity = _ref4.specificity;
      var rightSpecificity = _ref5.specificity;
      return rightSpecificity - leftSpecificity;
    }

    function match(element) {
      return function (node) {
        var _element$attributes = element.attributes,
            attributes = _element$attributes === void 0 ? [] : _element$attributes; // https://github.com/testing-library/dom-testing-library/issues/814

        var typeTextIndex = attributes.findIndex(function (attribute) {
          return attribute.value && attribute.name === 'type' && attribute.value === 'text';
        });

        if (typeTextIndex >= 0) {
          // not using splice to not mutate the attributes array
          attributes = [].concat(attributes.slice(0, typeTextIndex), attributes.slice(typeTextIndex + 1));

          if (node.type !== 'text') {
            return false;
          }
        }

        return node.matches(makeElementSelector(_extends({}, element, {
          attributes: attributes
        })));
      };
    }

    var result = []; // eslint bug here:
    // eslint-disable-next-line no-unused-vars

    for (var _iterator2 = _createForOfIteratorHelperLoose(elementRolesMap.entries()), _step2; !(_step2 = _iterator2()).done;) {
      var _step2$value = _step2.value,
          element = _step2$value[0],
          roles = _step2$value[1];
      result = [].concat(result, [{
        match: match(element),
        roles: Array.from(roles),
        specificity: getSelectorSpecificity(element)
      }]);
    }

    return result.sort(bySelectorSpecificity);
  }

  function getRoles(container, _temp) {
    var _ref6 = _temp === void 0 ? {} : _temp,
        _ref6$hidden = _ref6.hidden,
        hidden = _ref6$hidden === void 0 ? false : _ref6$hidden;

    function flattenDOM(node) {
      return [node].concat(Array.from(node.children).reduce(function (acc, child) {
        return [].concat(acc, flattenDOM(child));
      }, []));
    }

    return flattenDOM(container).filter(function (element) {
      return hidden === false ? isInaccessible(element) === false : true;
    }).reduce(function (acc, node) {
      var roles = []; // TODO: This violates html-aria which does not allow any role on every element

      if (node.hasAttribute('role')) {
        roles = node.getAttribute('role').split(' ').slice(0, 1);
      } else {
        roles = getImplicitAriaRoles(node);
      }

      return roles.reduce(function (rolesAcc, role) {
        var _extends2, _extends3;

        return Array.isArray(rolesAcc[role]) ? _extends({}, rolesAcc, (_extends2 = {}, _extends2[role] = [].concat(rolesAcc[role], [node]), _extends2)) : _extends({}, rolesAcc, (_extends3 = {}, _extends3[role] = [node], _extends3));
      }, acc);
    }, {});
  }

  function prettyRoles(dom, _ref7) {
    var hidden = _ref7.hidden;
    var roles = getRoles(dom, {
      hidden: hidden
    }); // We prefer to skip generic role, we don't recommend it

    return Object.entries(roles).filter(function (_ref8) {
      var role = _ref8[0];
      return role !== 'generic';
    }).map(function (_ref9) {
      var role = _ref9[0],
          elements = _ref9[1];
      var delimiterBar = '-'.repeat(50);
      var elementsString = elements.map(function (el) {
        var nameString = "Name \"" + computeAccessibleName(el, {
          computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
        }) + "\":\n";
        var domString = prettyDOM(el.cloneNode(false));
        return "" + nameString + domString;
      }).join('\n\n');
      return role + ":\n\n" + elementsString + "\n\n" + delimiterBar;
    }).join('\n');
  }

  var logRoles = function logRoles(dom, _temp2) {
    var _ref10 = _temp2 === void 0 ? {} : _temp2,
        _ref10$hidden = _ref10.hidden,
        hidden = _ref10$hidden === void 0 ? false : _ref10$hidden;

    return console.log(prettyRoles(dom, {
      hidden: hidden
    }));
  };
  /**
   * @param {Element} element -
   * @returns {boolean | undefined} - false/true if (not)selected, undefined if not selectable
   */


  function computeAriaSelected(element) {
    // implicit value from html-aam mappings: https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
    // https://www.w3.org/TR/html-aam-1.0/#details-id-97
    if (element.tagName === 'OPTION') {
      return element.selected;
    } // explicit value


    return checkBooleanAttribute(element, 'aria-selected');
  }
  /**
   * @param {Element} element -
   * @returns {boolean | undefined} - false/true if (not)checked, undefined if not checked-able
   */


  function computeAriaChecked(element) {
    // implicit value from html-aam mappings: https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
    // https://www.w3.org/TR/html-aam-1.0/#details-id-56
    // https://www.w3.org/TR/html-aam-1.0/#details-id-67
    if ('indeterminate' in element && element.indeterminate) {
      return undefined;
    }

    if ('checked' in element) {
      return element.checked;
    } // explicit value


    return checkBooleanAttribute(element, 'aria-checked');
  }
  /**
   * @param {Element} element -
   * @returns {boolean | undefined} - false/true if (not)pressed, undefined if not press-able
   */


  function computeAriaPressed(element) {
    // https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
    return checkBooleanAttribute(element, 'aria-pressed');
  }
  /**
   * @param {Element} element -
   * @returns {boolean | string | null} -
   */


  function computeAriaCurrent(element) {
    var _ref11, _checkBooleanAttribut; // https://www.w3.org/TR/wai-aria-1.1/#aria-current


    return (_ref11 = (_checkBooleanAttribut = checkBooleanAttribute(element, 'aria-current')) != null ? _checkBooleanAttribut : element.getAttribute('aria-current')) != null ? _ref11 : false;
  }
  /**
   * @param {Element} element -
   * @returns {boolean | undefined} - false/true if (not)expanded, undefined if not expand-able
   */


  function computeAriaExpanded(element) {
    // https://www.w3.org/TR/wai-aria-1.1/#aria-expanded
    return checkBooleanAttribute(element, 'aria-expanded');
  }

  function checkBooleanAttribute(element, attribute) {
    var attributeValue = element.getAttribute(attribute);

    if (attributeValue === 'true') {
      return true;
    }

    if (attributeValue === 'false') {
      return false;
    }

    return undefined;
  }
  /**
   * @param {Element} element -
   * @returns {number | undefined} - number if implicit heading or aria-level present, otherwise undefined
   */


  function computeHeadingLevel(element) {
    // https://w3c.github.io/html-aam/#el-h1-h6
    // https://w3c.github.io/html-aam/#el-h1-h6
    var implicitHeadingLevels = {
      H1: 1,
      H2: 2,
      H3: 3,
      H4: 4,
      H5: 5,
      H6: 6
    }; // explicit aria-level value
    // https://www.w3.org/TR/wai-aria-1.2/#aria-level

    var ariaLevelAttribute = element.getAttribute('aria-level') && Number(element.getAttribute('aria-level'));
    return ariaLevelAttribute || implicitHeadingLevels[element.tagName];
  }

  var normalize = getDefaultNormalizer();

  function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  function getRegExpMatcher(string) {
    return new RegExp(escapeRegExp(string.toLowerCase()), 'i');
  }

  function makeSuggestion(queryName, element, content, _ref) {
    var variant = _ref.variant,
        name = _ref.name;
    var warning = '';
    var queryOptions = {};
    var queryArgs = [['Role', 'TestId'].includes(queryName) ? content : getRegExpMatcher(content)];

    if (name) {
      queryOptions.name = getRegExpMatcher(name);
    }

    if (queryName === 'Role' && isInaccessible(element)) {
      queryOptions.hidden = true;
      warning = "Element is inaccessible. This means that the element and all its children are invisible to screen readers.\n    If you are using the aria-hidden prop, make sure this is the right choice for your case.\n    ";
    }

    if (Object.keys(queryOptions).length > 0) {
      queryArgs.push(queryOptions);
    }

    var queryMethod = variant + "By" + queryName;
    return {
      queryName: queryName,
      queryMethod: queryMethod,
      queryArgs: queryArgs,
      variant: variant,
      warning: warning,
      toString: function toString() {
        if (warning) {
          console.warn(warning);
        }

        var text = queryArgs[0],
            options = queryArgs[1];
        text = typeof text === 'string' ? "'" + text + "'" : text;
        options = options ? ", { " + Object.entries(options).map(function (_ref2) {
          var k = _ref2[0],
              v = _ref2[1];
          return k + ": " + v;
        }).join(', ') + " }" : '';
        return queryMethod + "(" + text + options + ")";
      }
    };
  }

  function canSuggest(currentMethod, requestedMethod, data) {
    return data && (!requestedMethod || requestedMethod.toLowerCase() === currentMethod.toLowerCase());
  }

  function getSuggestedQuery(element, variant, method) {
    var _element$getAttribute, _getImplicitAriaRoles;

    if (variant === void 0) {
      variant = 'get';
    } // don't create suggestions for script and style elements


    if (element.matches(DEFAULT_IGNORE_TAGS)) {
      return undefined;
    } //We prefer to suggest something else if the role is generic


    var role = (_element$getAttribute = element.getAttribute('role')) != null ? _element$getAttribute : (_getImplicitAriaRoles = getImplicitAriaRoles(element)) == null ? void 0 : _getImplicitAriaRoles[0];

    if (role !== 'generic' && canSuggest('Role', method, role)) {
      return makeSuggestion('Role', element, role, {
        variant: variant,
        name: computeAccessibleName(element, {
          computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
        })
      });
    }

    var labelText = getLabels(document, element).map(function (label) {
      return label.content;
    }).join(' ');

    if (canSuggest('LabelText', method, labelText)) {
      return makeSuggestion('LabelText', element, labelText, {
        variant: variant
      });
    }

    var placeholderText = element.getAttribute('placeholder');

    if (canSuggest('PlaceholderText', method, placeholderText)) {
      return makeSuggestion('PlaceholderText', element, placeholderText, {
        variant: variant
      });
    }

    var textContent = normalize(getNodeText(element));

    if (canSuggest('Text', method, textContent)) {
      return makeSuggestion('Text', element, textContent, {
        variant: variant
      });
    }

    if (canSuggest('DisplayValue', method, element.value)) {
      return makeSuggestion('DisplayValue', element, normalize(element.value), {
        variant: variant
      });
    }

    var alt = element.getAttribute('alt');

    if (canSuggest('AltText', method, alt)) {
      return makeSuggestion('AltText', element, alt, {
        variant: variant
      });
    }

    var title = element.getAttribute('title');

    if (canSuggest('Title', method, title)) {
      return makeSuggestion('Title', element, title, {
        variant: variant
      });
    }

    var testId = element.getAttribute(getConfig().testIdAttribute);

    if (canSuggest('TestId', method, testId)) {
      return makeSuggestion('TestId', element, testId, {
        variant: variant
      });
    }

    return undefined;
  } // closer to their code (because async stack traces are hard to follow).


  function copyStackTrace(target, source) {
    target.stack = source.stack.replace(source.message, target.message);
  }

  function waitFor(callback, _ref) {
    var _ref$container = _ref.container,
        container = _ref$container === void 0 ? getDocument() : _ref$container,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? getConfig().asyncUtilTimeout : _ref$timeout,
        _ref$showOriginalStac = _ref.showOriginalStackTrace,
        showOriginalStackTrace = _ref$showOriginalStac === void 0 ? getConfig().showOriginalStackTrace : _ref$showOriginalStac,
        stackTraceError = _ref.stackTraceError,
        _ref$interval = _ref.interval,
        interval = _ref$interval === void 0 ? 50 : _ref$interval,
        _ref$onTimeout = _ref.onTimeout,
        onTimeout = _ref$onTimeout === void 0 ? function (error) {
      error.message = getConfig().getElementError(error.message, container).message;
      return error;
    } : _ref$onTimeout,
        _ref$mutationObserver = _ref.mutationObserverOptions,
        mutationObserverOptions = _ref$mutationObserver === void 0 ? {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    } : _ref$mutationObserver;

    if (typeof callback !== 'function') {
      throw new TypeError('Received `callback` arg must be a function');
    }

    return new Promise( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(resolve, reject) {
        var lastError, intervalId, observer, finished, promiseStatus, overallTimeoutTimer, usingJestFakeTimers, _getConfig, advanceTimersWrapper, error, _getWindowFromNode, MutationObserver, onDone, checkRealTimersCallback, checkCallback, handleTimeout;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                handleTimeout = function _handleTimeout() {
                  var error;

                  if (lastError) {
                    error = lastError;

                    if (!showOriginalStackTrace && error.name === 'TestingLibraryElementError') {
                      copyStackTrace(error, stackTraceError);
                    }
                  } else {
                    error = new Error('Timed out in waitFor.');

                    if (!showOriginalStackTrace) {
                      copyStackTrace(error, stackTraceError);
                    }
                  }

                  onDone(onTimeout(error), null);
                };

                checkCallback = function _checkCallback() {
                  if (promiseStatus === 'pending') return;

                  try {
                    var result = runWithExpensiveErrorDiagnosticsDisabled(callback);

                    if (typeof (result == null ? void 0 : result.then) === 'function') {
                      promiseStatus = 'pending';
                      result.then(function (resolvedValue) {
                        promiseStatus = 'resolved';
                        onDone(null, resolvedValue);
                      }, function (rejectedValue) {
                        promiseStatus = 'rejected';
                        lastError = rejectedValue;
                      });
                    } else {
                      onDone(null, result);
                    } // If `callback` throws, wait for the next mutation, interval, or timeout.

                  } catch (error) {
                    // Save the most recent callback error to reject the promise with it in the event of a timeout
                    lastError = error;
                  }
                };

                checkRealTimersCallback = function _checkRealTimersCallb() {
                  if (jestFakeTimersAreEnabled()) {
                    var _error = new Error("Changed from using real timers to fake timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to fake timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830");

                    if (!showOriginalStackTrace) copyStackTrace(_error, stackTraceError);
                    return reject(_error);
                  } else {
                    return checkCallback();
                  }
                };

                onDone = function _onDone(error, result) {
                  finished = true;
                  clearTimeout(overallTimeoutTimer);

                  if (!usingJestFakeTimers) {
                    clearInterval(intervalId);
                    observer.disconnect();
                  }

                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                };

                finished = false;
                promiseStatus = 'idle';
                overallTimeoutTimer = setTimeout(handleTimeout, timeout);
                usingJestFakeTimers = jestFakeTimersAreEnabled();

                if (!usingJestFakeTimers) {
                  _context2.next = 27;
                  break;
                }

                _getConfig = getConfig(), advanceTimersWrapper = _getConfig.unstable_advanceTimersWrapper;
                checkCallback();
              // this is a dangerous rule to disable because it could lead to an
              // infinite loop. However, eslint isn't smart enough to know that we're
              // setting finished inside `onDone` which will be called when we're done
              // waiting or when we've timed out.
              // eslint-disable-next-line no-unmodified-loop-condition

              case 11:
                if (finished) {
                  _context2.next = 25;
                  break;
                }

                if (jestFakeTimersAreEnabled()) {
                  _context2.next = 17;
                  break;
                }

                error = new Error("Changed from using fake timers to real timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to real timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830");
                if (!showOriginalStackTrace) copyStackTrace(error, stackTraceError);
                reject(error);
                return _context2.abrupt("return");

              case 17:
                // we *could* (maybe should?) use `advanceTimersToNextTimer` but it's
                // possible that could make this loop go on forever if someone is using
                // third party code that's setting up recursive timers so rapidly that
                // the user's timer's don't get a chance to resolve. So we'll advance
                // by an interval instead. (We have a test for this case).
                advanceTimersWrapper(function () {
                  jest.advanceTimersByTime(interval);
                }); // It's really important that checkCallback is run *before* we flush
                // in-flight promises. To be honest, I'm not sure why, and I can't quite
                // think of a way to reproduce the problem in a test, but I spent
                // an entire day banging my head against a wall on this.

                checkCallback();

                if (!finished) {
                  _context2.next = 21;
                  break;
                }

                return _context2.abrupt("break", 25);

              case 21:
                _context2.next = 23;
                return advanceTimersWrapper( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
                  return regenerator.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return new Promise(function (r) {
                            setTimeout(r, 0);
                            jest.advanceTimersByTime(0);
                          });

                        case 2:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })));

              case 23:
                _context2.next = 11;
                break;

              case 25:
                _context2.next = 40;
                break;

              case 27:
                _context2.prev = 27;
                checkContainerType(container);
                _context2.next = 35;
                break;

              case 31:
                _context2.prev = 31;
                _context2.t0 = _context2["catch"](27);
                reject(_context2.t0);
                return _context2.abrupt("return");

              case 35:
                intervalId = setInterval(checkRealTimersCallback, interval);
                _getWindowFromNode = getWindowFromNode(container), MutationObserver = _getWindowFromNode.MutationObserver;
                observer = new MutationObserver(checkRealTimersCallback);
                observer.observe(container, mutationObserverOptions);
                checkCallback();

              case 40:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[27, 31]]);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  }

  function waitForWrapper(callback, options) {
    // create the error here so its stack trace is as close to the
    // calling code as possible
    var stackTraceError = new Error('STACK_TRACE_MESSAGE');
    return getConfig().asyncWrapper(function () {
      return waitFor(callback, _extends({
        stackTraceError: stackTraceError
      }, options));
    });
  }
  /*
  eslint
    max-lines-per-function: ["error", {"max": 200}],
  */


  function getElementError(message, container) {
    return getConfig().getElementError(message, container);
  }

  function getMultipleElementsFoundError(message, container) {
    return getElementError(message + "\n\n(If this is intentional, then use the `*AllBy*` variant of the query (like `queryAllByText`, `getAllByText`, or `findAllByText`)).", container);
  }

  function queryAllByAttribute(attribute, container, text, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$exact = _ref.exact,
        exact = _ref$exact === void 0 ? true : _ref$exact,
        collapseWhitespace = _ref.collapseWhitespace,
        trim = _ref.trim,
        normalizer = _ref.normalizer;

    var matcher = exact ? matches : fuzzyMatches;
    var matchNormalizer = makeNormalizer({
      collapseWhitespace: collapseWhitespace,
      trim: trim,
      normalizer: normalizer
    });
    return Array.from(container.querySelectorAll("[" + attribute + "]")).filter(function (node) {
      return matcher(node.getAttribute(attribute), node, text, matchNormalizer);
    });
  }

  function queryByAttribute(attribute, container, text, options) {
    var els = queryAllByAttribute(attribute, container, text, options);

    if (els.length > 1) {
      throw getMultipleElementsFoundError("Found multiple elements by [" + attribute + "=" + text + "]", container);
    }

    return els[0] || null;
  } // this accepts a query function and returns a function which throws an error
  // if more than one elements is returned, otherwise it returns the first
  // element or null


  function makeSingleQuery(allQuery, getMultipleError) {
    return function (container) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var els = allQuery.apply(void 0, [container].concat(args));

      if (els.length > 1) {
        var elementStrings = els.map(function (element) {
          return getElementError(null, element).message;
        }).join('\n\n');
        throw getMultipleElementsFoundError(getMultipleError.apply(void 0, [container].concat(args)) + "\n\nHere are the matching elements:\n\n" + elementStrings, container);
      }

      return els[0] || null;
    };
  }

  function getSuggestionError(suggestion, container) {
    return getConfig().getElementError("A better query is available, try this:\n" + suggestion.toString() + "\n", container);
  } // this accepts a query function and returns a function which throws an error
  // if an empty list of elements is returned


  function makeGetAllQuery(allQuery, getMissingError) {
    return function (container) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var els = allQuery.apply(void 0, [container].concat(args));

      if (!els.length) {
        throw getConfig().getElementError(getMissingError.apply(void 0, [container].concat(args)), container);
      }

      return els;
    };
  } // this accepts a getter query function and returns a function which calls
  // waitFor and passing a function which invokes the getter.


  function makeFindQuery(getter) {
    return function (container, text, options, waitForOptions) {
      return waitForWrapper(function () {
        return getter(container, text, options);
      }, _extends({
        container: container
      }, waitForOptions));
    };
  }

  var wrapSingleQueryWithSuggestion = function wrapSingleQueryWithSuggestion(query, queryAllByName, variant) {
    return function (container) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var element = query.apply(void 0, [container].concat(args));

      var _ref2 = args.slice(-1),
          _ref2$ = _ref2[0];

      _ref2$ = _ref2$ === void 0 ? {} : _ref2$;
      var _ref2$$suggest = _ref2$.suggest,
          suggest = _ref2$$suggest === void 0 ? getConfig().throwSuggestions : _ref2$$suggest;

      if (element && suggest) {
        var suggestion = getSuggestedQuery(element, variant);

        if (suggestion && !queryAllByName.endsWith(suggestion.queryName)) {
          throw getSuggestionError(suggestion.toString(), container);
        }
      }

      return element;
    };
  };

  var wrapAllByQueryWithSuggestion = function wrapAllByQueryWithSuggestion(query, queryAllByName, variant) {
    return function (container) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var els = query.apply(void 0, [container].concat(args));

      var _ref3 = args.slice(-1),
          _ref3$ = _ref3[0];

      _ref3$ = _ref3$ === void 0 ? {} : _ref3$;
      var _ref3$$suggest = _ref3$.suggest,
          suggest = _ref3$$suggest === void 0 ? getConfig().throwSuggestions : _ref3$$suggest;

      if (els.length && suggest) {
        // get a unique list of all suggestion messages.  We are only going to make a suggestion if
        // all the suggestions are the same
        var uniqueSuggestionMessages = [].concat(new Set(els.map(function (element) {
          var _getSuggestedQuery;

          return (_getSuggestedQuery = getSuggestedQuery(element, variant)) == null ? void 0 : _getSuggestedQuery.toString();
        })));

        if ( // only want to suggest if all the els have the same suggestion.
        uniqueSuggestionMessages.length === 1 && !queryAllByName.endsWith( // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO: Can this be null at runtime?
        getSuggestedQuery(els[0], variant).queryName)) {
          throw getSuggestionError(uniqueSuggestionMessages[0], container);
        }
      }

      return els;
    };
  }; // TODO: This deviates from the published declarations
  // However, the implementation always required a dyadic (after `container`) not variadic `queryAllBy` considering the implementation of `makeFindQuery`
  // This is at least statically true and can be verified by accepting `QueryMethod<Arguments, HTMLElement[]>`


  function buildQueries(queryAllBy, getMultipleError, getMissingError) {
    var queryBy = wrapSingleQueryWithSuggestion(makeSingleQuery(queryAllBy, getMultipleError), queryAllBy.name, 'query');
    var getAllBy = makeGetAllQuery(queryAllBy, getMissingError);
    var getBy = makeSingleQuery(getAllBy, getMultipleError);
    var getByWithSuggestions = wrapSingleQueryWithSuggestion(getBy, queryAllBy.name, 'get');
    var getAllWithSuggestions = wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name.replace('query', 'get'), 'getAll');
    var findAllBy = makeFindQuery(wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name, 'findAll'));
    var findBy = makeFindQuery(wrapSingleQueryWithSuggestion(getBy, queryAllBy.name, 'find'));
    return [queryBy, getAllWithSuggestions, getByWithSuggestions, findAllBy, findBy];
  }

  var queryHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getElementError: getElementError,
    wrapAllByQueryWithSuggestion: wrapAllByQueryWithSuggestion,
    wrapSingleQueryWithSuggestion: wrapSingleQueryWithSuggestion,
    getMultipleElementsFoundError: getMultipleElementsFoundError,
    queryAllByAttribute: queryAllByAttribute,
    queryByAttribute: queryByAttribute,
    makeSingleQuery: makeSingleQuery,
    makeGetAllQuery: makeGetAllQuery,
    makeFindQuery: makeFindQuery,
    buildQueries: buildQueries
  });

  function queryAllLabels(container) {
    return Array.from(container.querySelectorAll('label,input')).map(function (node) {
      return {
        node: node,
        textToMatch: getLabelContent(node)
      };
    }).filter(function (_ref) {
      var textToMatch = _ref.textToMatch;
      return textToMatch !== null;
    });
  }

  var queryAllLabelsByText = function queryAllLabelsByText(container, text, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        _ref2$exact = _ref2.exact,
        exact = _ref2$exact === void 0 ? true : _ref2$exact,
        trim = _ref2.trim,
        collapseWhitespace = _ref2.collapseWhitespace,
        normalizer = _ref2.normalizer;

    var matcher = exact ? matches : fuzzyMatches;
    var matchNormalizer = makeNormalizer({
      collapseWhitespace: collapseWhitespace,
      trim: trim,
      normalizer: normalizer
    });
    var textToMatchByLabels = queryAllLabels(container);
    return textToMatchByLabels.filter(function (_ref3) {
      var node = _ref3.node,
          textToMatch = _ref3.textToMatch;
      return matcher(textToMatch, node, text, matchNormalizer);
    }).map(function (_ref4) {
      var node = _ref4.node;
      return node;
    });
  };

  var queryAllByLabelText = function queryAllByLabelText(container, text, _temp2) {
    var _ref5 = _temp2 === void 0 ? {} : _temp2,
        _ref5$selector = _ref5.selector,
        selector = _ref5$selector === void 0 ? '*' : _ref5$selector,
        _ref5$exact = _ref5.exact,
        exact = _ref5$exact === void 0 ? true : _ref5$exact,
        collapseWhitespace = _ref5.collapseWhitespace,
        trim = _ref5.trim,
        normalizer = _ref5.normalizer;

    checkContainerType(container);
    var matcher = exact ? matches : fuzzyMatches;
    var matchNormalizer = makeNormalizer({
      collapseWhitespace: collapseWhitespace,
      trim: trim,
      normalizer: normalizer
    });
    var matchingLabelledElements = Array.from(container.querySelectorAll('*')).filter(function (element) {
      return getRealLabels(element).length || element.hasAttribute('aria-labelledby');
    }).reduce(function (labelledElements, labelledElement) {
      var labelList = getLabels(container, labelledElement, {
        selector: selector
      });
      labelList.filter(function (label) {
        return Boolean(label.formControl);
      }).forEach(function (label) {
        if (matcher(label.content, label.formControl, text, matchNormalizer) && label.formControl) labelledElements.push(label.formControl);
      });
      var labelsValue = labelList.filter(function (label) {
        return Boolean(label.content);
      }).map(function (label) {
        return label.content;
      });
      if (matcher(labelsValue.join(' '), labelledElement, text, matchNormalizer)) labelledElements.push(labelledElement);

      if (labelsValue.length > 1) {
        labelsValue.forEach(function (labelValue, index) {
          if (matcher(labelValue, labelledElement, text, matchNormalizer)) labelledElements.push(labelledElement);
          var labelsFiltered = [].concat(labelsValue);
          labelsFiltered.splice(index, 1);

          if (labelsFiltered.length > 1) {
            if (matcher(labelsFiltered.join(' '), labelledElement, text, matchNormalizer)) labelledElements.push(labelledElement);
          }
        });
      }

      return labelledElements;
    }, []).concat(queryAllByAttribute('aria-label', container, text, {
      exact: exact,
      normalizer: matchNormalizer
    }));
    return Array.from(new Set(matchingLabelledElements)).filter(function (element) {
      return element.matches(selector);
    });
  }; // the getAll* query would normally look like this:
  // const getAllByLabelText = makeGetAllQuery(
  //   queryAllByLabelText,
  //   (c, text) => `Unable to find a label with the text of: ${text}`,
  // )
  // however, we can give a more helpful error message than the generic one,
  // so we're writing this one out by hand.


  var getAllByLabelText = function getAllByLabelText(container, text) {
    for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    var els = queryAllByLabelText.apply(void 0, [container, text].concat(rest));

    if (!els.length) {
      var labels = queryAllLabelsByText.apply(void 0, [container, text].concat(rest));

      if (labels.length) {
        var tagNames = labels.map(function (label) {
          return getTagNameOfElementAssociatedWithLabelViaFor(container, label);
        }).filter(function (tagName) {
          return !!tagName;
        });

        if (tagNames.length) {
          throw getConfig().getElementError(tagNames.map(function (tagName) {
            return "Found a label with the text of: " + text + ", however the element associated with this label (<" + tagName + " />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <" + tagName + " />, you can use aria-label or aria-labelledby instead.";
          }).join('\n\n'), container);
        } else {
          throw getConfig().getElementError("Found a label with the text of: " + text + ", however no form control was found associated to that label. Make sure you're using the \"for\" attribute or \"aria-labelledby\" attribute correctly.", container);
        }
      } else {
        throw getConfig().getElementError("Unable to find a label with the text of: " + text, container);
      }
    }

    return els;
  };

  function getTagNameOfElementAssociatedWithLabelViaFor(container, label) {
    var htmlFor = label.getAttribute('for');

    if (!htmlFor) {
      return null;
    }

    var element = container.querySelector("[id=\"" + htmlFor + "\"]");
    return element ? element.tagName.toLowerCase() : null;
  } // the reason mentioned above is the same reason we're not using buildQueries


  var getMultipleError$7 = function getMultipleError(c, text) {
    return "Found multiple elements with the text of: " + text;
  };

  var queryByLabelText = wrapSingleQueryWithSuggestion(makeSingleQuery(queryAllByLabelText, getMultipleError$7), queryAllByLabelText.name, 'query');
  var getByLabelText = makeSingleQuery(getAllByLabelText, getMultipleError$7);
  var findAllByLabelText = makeFindQuery(wrapAllByQueryWithSuggestion(getAllByLabelText, getAllByLabelText.name, 'findAll'));
  var findByLabelText = makeFindQuery(wrapSingleQueryWithSuggestion(getByLabelText, getAllByLabelText.name, 'find'));
  var getAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion(getAllByLabelText, getAllByLabelText.name, 'getAll');
  var getByLabelTextWithSuggestions = wrapSingleQueryWithSuggestion(getByLabelText, getAllByLabelText.name, 'get');
  var queryAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByLabelText, queryAllByLabelText.name, 'queryAll');

  var queryAllByPlaceholderText = function queryAllByPlaceholderText() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    checkContainerType(args[0]);
    return queryAllByAttribute.apply(void 0, ['placeholder'].concat(args));
  };

  var getMultipleError$6 = function getMultipleError(c, text) {
    return "Found multiple elements with the placeholder text of: " + text;
  };

  var getMissingError$6 = function getMissingError(c, text) {
    return "Unable to find an element with the placeholder text of: " + text;
  };

  var queryAllByPlaceholderTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByPlaceholderText, queryAllByPlaceholderText.name, 'queryAll');

  var _buildQueries$6 = buildQueries(queryAllByPlaceholderText, getMultipleError$6, getMissingError$6),
      queryByPlaceholderText = _buildQueries$6[0],
      getAllByPlaceholderText = _buildQueries$6[1],
      getByPlaceholderText = _buildQueries$6[2],
      findAllByPlaceholderText = _buildQueries$6[3],
      findByPlaceholderText = _buildQueries$6[4];

  var queryAllByText = function queryAllByText(container, text, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? '*' : _ref$selector,
        _ref$exact = _ref.exact,
        exact = _ref$exact === void 0 ? true : _ref$exact,
        collapseWhitespace = _ref.collapseWhitespace,
        trim = _ref.trim,
        _ref$ignore = _ref.ignore,
        ignore = _ref$ignore === void 0 ? DEFAULT_IGNORE_TAGS : _ref$ignore,
        normalizer = _ref.normalizer;

    checkContainerType(container);
    var matcher = exact ? matches : fuzzyMatches;
    var matchNormalizer = makeNormalizer({
      collapseWhitespace: collapseWhitespace,
      trim: trim,
      normalizer: normalizer
    });
    var baseArray = [];

    if (typeof container.matches === 'function' && container.matches(selector)) {
      baseArray = [container];
    }

    return [].concat(baseArray, Array.from(container.querySelectorAll(selector))) // TODO: `matches` according lib.dom.d.ts can get only `string` but according our code it can handle also boolean :)
    .filter(function (node) {
      return !ignore || !node.matches(ignore);
    }).filter(function (node) {
      return matcher(getNodeText(node), node, text, matchNormalizer);
    });
  };

  var getMultipleError$5 = function getMultipleError(c, text) {
    return "Found multiple elements with the text: " + text;
  };

  var getMissingError$5 = function getMissingError(c, text) {
    return "Unable to find an element with the text: " + text + ". This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.";
  };

  var queryAllByTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByText, queryAllByText.name, 'queryAll');

  var _buildQueries$5 = buildQueries(queryAllByText, getMultipleError$5, getMissingError$5),
      queryByText = _buildQueries$5[0],
      getAllByText = _buildQueries$5[1],
      getByText = _buildQueries$5[2],
      findAllByText = _buildQueries$5[3],
      findByText = _buildQueries$5[4];

  var queryAllByDisplayValue = function queryAllByDisplayValue(container, value, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$exact = _ref.exact,
        exact = _ref$exact === void 0 ? true : _ref$exact,
        collapseWhitespace = _ref.collapseWhitespace,
        trim = _ref.trim,
        normalizer = _ref.normalizer;

    checkContainerType(container);
    var matcher = exact ? matches : fuzzyMatches;
    var matchNormalizer = makeNormalizer({
      collapseWhitespace: collapseWhitespace,
      trim: trim,
      normalizer: normalizer
    });
    return Array.from(container.querySelectorAll("input,textarea,select")).filter(function (node) {
      if (node.tagName === 'SELECT') {
        var selectedOptions = Array.from(node.options).filter(function (option) {
          return option.selected;
        });
        return selectedOptions.some(function (optionNode) {
          return matcher(getNodeText(optionNode), optionNode, value, matchNormalizer);
        });
      } else {
        return matcher(node.value, node, value, matchNormalizer);
      }
    });
  };

  var getMultipleError$4 = function getMultipleError(c, value) {
    return "Found multiple elements with the display value: " + value + ".";
  };

  var getMissingError$4 = function getMissingError(c, value) {
    return "Unable to find an element with the display value: " + value + ".";
  };

  var queryAllByDisplayValueWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByDisplayValue, queryAllByDisplayValue.name, 'queryAll');

  var _buildQueries$4 = buildQueries(queryAllByDisplayValue, getMultipleError$4, getMissingError$4),
      queryByDisplayValue = _buildQueries$4[0],
      getAllByDisplayValue = _buildQueries$4[1],
      getByDisplayValue = _buildQueries$4[2],
      findAllByDisplayValue = _buildQueries$4[3],
      findByDisplayValue = _buildQueries$4[4];

  var VALID_TAG_REGEXP = /^(img|input|area|.+-.+)$/i;

  var queryAllByAltText = function queryAllByAltText(container, alt, options) {
    if (options === void 0) {
      options = {};
    }

    checkContainerType(container);
    return queryAllByAttribute('alt', container, alt, options).filter(function (node) {
      return VALID_TAG_REGEXP.test(node.tagName);
    });
  };

  var getMultipleError$3 = function getMultipleError(c, alt) {
    return "Found multiple elements with the alt text: " + alt;
  };

  var getMissingError$3 = function getMissingError(c, alt) {
    return "Unable to find an element with the alt text: " + alt;
  };

  var queryAllByAltTextWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByAltText, queryAllByAltText.name, 'queryAll');

  var _buildQueries$3 = buildQueries(queryAllByAltText, getMultipleError$3, getMissingError$3),
      queryByAltText = _buildQueries$3[0],
      getAllByAltText = _buildQueries$3[1],
      getByAltText = _buildQueries$3[2],
      findAllByAltText = _buildQueries$3[3],
      findByAltText = _buildQueries$3[4];

  var isSvgTitle = function isSvgTitle(node) {
    var _node$parentElement;

    return node.tagName.toLowerCase() === 'title' && ((_node$parentElement = node.parentElement) == null ? void 0 : _node$parentElement.tagName.toLowerCase()) === 'svg';
  };

  var queryAllByTitle = function queryAllByTitle(container, text, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$exact = _ref.exact,
        exact = _ref$exact === void 0 ? true : _ref$exact,
        collapseWhitespace = _ref.collapseWhitespace,
        trim = _ref.trim,
        normalizer = _ref.normalizer;

    checkContainerType(container);
    var matcher = exact ? matches : fuzzyMatches;
    var matchNormalizer = makeNormalizer({
      collapseWhitespace: collapseWhitespace,
      trim: trim,
      normalizer: normalizer
    });
    return Array.from(container.querySelectorAll('[title], svg > title')).filter(function (node) {
      return matcher(node.getAttribute('title'), node, text, matchNormalizer) || isSvgTitle(node) && matcher(getNodeText(node), node, text, matchNormalizer);
    });
  };

  var getMultipleError$2 = function getMultipleError(c, title) {
    return "Found multiple elements with the title: " + title + ".";
  };

  var getMissingError$2 = function getMissingError(c, title) {
    return "Unable to find an element with the title: " + title + ".";
  };

  var queryAllByTitleWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByTitle, queryAllByTitle.name, 'queryAll');

  var _buildQueries$2 = buildQueries(queryAllByTitle, getMultipleError$2, getMissingError$2),
      queryByTitle = _buildQueries$2[0],
      getAllByTitle = _buildQueries$2[1],
      getByTitle = _buildQueries$2[2],
      findAllByTitle = _buildQueries$2[3],
      findByTitle = _buildQueries$2[4];

  function queryAllByRole(container, role, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$exact = _ref.exact,
        exact = _ref$exact === void 0 ? true : _ref$exact,
        collapseWhitespace = _ref.collapseWhitespace,
        _ref$hidden = _ref.hidden,
        hidden = _ref$hidden === void 0 ? getConfig().defaultHidden : _ref$hidden,
        name = _ref.name,
        trim = _ref.trim,
        normalizer = _ref.normalizer,
        _ref$queryFallbacks = _ref.queryFallbacks,
        queryFallbacks = _ref$queryFallbacks === void 0 ? false : _ref$queryFallbacks,
        selected = _ref.selected,
        checked = _ref.checked,
        pressed = _ref.pressed,
        current = _ref.current,
        level = _ref.level,
        expanded = _ref.expanded;

    checkContainerType(container);
    var matcher = exact ? matches : fuzzyMatches;
    var matchNormalizer = makeNormalizer({
      collapseWhitespace: collapseWhitespace,
      trim: trim,
      normalizer: normalizer
    });

    if (selected !== undefined) {
      var _allRoles$get; // guard against unknown roles


      if (((_allRoles$get = roles_1.get(role)) == null ? void 0 : _allRoles$get.props['aria-selected']) === undefined) {
        throw new Error("\"aria-selected\" is not supported on role \"" + role + "\".");
      }
    }

    if (checked !== undefined) {
      var _allRoles$get2; // guard against unknown roles


      if (((_allRoles$get2 = roles_1.get(role)) == null ? void 0 : _allRoles$get2.props['aria-checked']) === undefined) {
        throw new Error("\"aria-checked\" is not supported on role \"" + role + "\".");
      }
    }

    if (pressed !== undefined) {
      var _allRoles$get3; // guard against unknown roles


      if (((_allRoles$get3 = roles_1.get(role)) == null ? void 0 : _allRoles$get3.props['aria-pressed']) === undefined) {
        throw new Error("\"aria-pressed\" is not supported on role \"" + role + "\".");
      }
    }

    if (current !== undefined) {
      var _allRoles$get4;
      /* istanbul ignore next */
      // guard against unknown roles
      // All currently released ARIA versions support `aria-current` on all roles.
      // Leaving this for symetry and forward compatibility


      if (((_allRoles$get4 = roles_1.get(role)) == null ? void 0 : _allRoles$get4.props['aria-current']) === undefined) {
        throw new Error("\"aria-current\" is not supported on role \"" + role + "\".");
      }
    }

    if (level !== undefined) {
      // guard against using `level` option with any role other than `heading`
      if (role !== 'heading') {
        throw new Error("Role \"" + role + "\" cannot have \"level\" property.");
      }
    }

    if (expanded !== undefined) {
      var _allRoles$get5; // guard against unknown roles


      if (((_allRoles$get5 = roles_1.get(role)) == null ? void 0 : _allRoles$get5.props['aria-expanded']) === undefined) {
        throw new Error("\"aria-expanded\" is not supported on role \"" + role + "\".");
      }
    }

    var subtreeIsInaccessibleCache = new WeakMap();

    function cachedIsSubtreeInaccessible(element) {
      if (!subtreeIsInaccessibleCache.has(element)) {
        subtreeIsInaccessibleCache.set(element, isSubtreeInaccessible(element));
      }

      return subtreeIsInaccessibleCache.get(element);
    }

    return Array.from(container.querySelectorAll( // Only query elements that can be matched by the following filters
    makeRoleSelector(role, exact, normalizer ? matchNormalizer : undefined))).filter(function (node) {
      var isRoleSpecifiedExplicitly = node.hasAttribute('role');

      if (isRoleSpecifiedExplicitly) {
        var roleValue = node.getAttribute('role');

        if (queryFallbacks) {
          return roleValue.split(' ').filter(Boolean).some(function (text) {
            return matcher(text, node, role, matchNormalizer);
          });
        } // if a custom normalizer is passed then let normalizer handle the role value


        if (normalizer) {
          return matcher(roleValue, node, role, matchNormalizer);
        } // other wise only send the first word to match


        var _roleValue$split = roleValue.split(' '),
            firstWord = _roleValue$split[0];

        return matcher(firstWord, node, role, matchNormalizer);
      }

      var implicitRoles = getImplicitAriaRoles(node);
      return implicitRoles.some(function (implicitRole) {
        return matcher(implicitRole, node, role, matchNormalizer);
      });
    }).filter(function (element) {
      if (selected !== undefined) {
        return selected === computeAriaSelected(element);
      }

      if (checked !== undefined) {
        return checked === computeAriaChecked(element);
      }

      if (pressed !== undefined) {
        return pressed === computeAriaPressed(element);
      }

      if (current !== undefined) {
        return current === computeAriaCurrent(element);
      }

      if (expanded !== undefined) {
        return expanded === computeAriaExpanded(element);
      }

      if (level !== undefined) {
        return level === computeHeadingLevel(element);
      } // don't care if aria attributes are unspecified


      return true;
    }).filter(function (element) {
      if (name === undefined) {
        // Don't care
        return true;
      }

      return matches(computeAccessibleName(element, {
        computedStyleSupportsPseudoElements: getConfig().computedStyleSupportsPseudoElements
      }), element, name, function (text) {
        return text;
      });
    }).filter(function (element) {
      return hidden === false ? isInaccessible(element, {
        isSubtreeInaccessible: cachedIsSubtreeInaccessible
      }) === false : true;
    });
  }

  function makeRoleSelector(role, exact, customNormalizer) {
    var _roleElements$get;

    if (typeof role !== 'string') {
      // For non-string role parameters we can not determine the implicitRoleSelectors.
      return '*';
    }

    var explicitRoleSelector = exact && !customNormalizer ? "*[role~=\"" + role + "\"]" : '*[role]';
    var roleRelations = (_roleElements$get = roleElements_1.get(role)) != null ? _roleElements$get : new Set();
    var implicitRoleSelectors = new Set(Array.from(roleRelations).map(function (_ref2) {
      var name = _ref2.name;
      return name;
    })); // Current transpilation config sometimes assumes `...` is always applied to arrays.
    // `...` is equivalent to `Array.prototype.concat` for arrays.
    // If you replace this code with `[explicitRoleSelector, ...implicitRoleSelectors]`, make sure every transpilation target retains the `...` in favor of `Array.prototype.concat`.

    return [explicitRoleSelector].concat(Array.from(implicitRoleSelectors)).join(',');
  }

  var getMultipleError$1 = function getMultipleError(c, role, _temp2) {
    var _ref3 = _temp2 === void 0 ? {} : _temp2,
        name = _ref3.name;

    var nameHint = '';

    if (name === undefined) {
      nameHint = '';
    } else if (typeof name === 'string') {
      nameHint = " and name \"" + name + "\"";
    } else {
      nameHint = " and name `" + name + "`";
    }

    return "Found multiple elements with the role \"" + role + "\"" + nameHint;
  };

  var getMissingError$1 = function getMissingError(container, role, _temp3) {
    var _ref4 = _temp3 === void 0 ? {} : _temp3,
        _ref4$hidden = _ref4.hidden,
        hidden = _ref4$hidden === void 0 ? getConfig().defaultHidden : _ref4$hidden,
        name = _ref4.name;

    if (getConfig()._disableExpensiveErrorDiagnostics) {
      return "Unable to find role=\"" + role + "\"";
    }

    var roles = '';
    Array.from(container.children).forEach(function (childElement) {
      roles += prettyRoles(childElement, {
        hidden: hidden,
        includeName: name !== undefined
      });
    });
    var roleMessage;

    if (roles.length === 0) {
      if (hidden === false) {
        roleMessage = 'There are no accessible roles. But there might be some inaccessible roles. ' + 'If you wish to access them, then set the `hidden` option to `true`. ' + 'Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole';
      } else {
        roleMessage = 'There are no available roles.';
      }
    } else {
      roleMessage = ("\nHere are the " + (hidden === false ? 'accessible' : 'available') + " roles:\n\n  " + roles.replace(/\n/g, '\n  ').replace(/\n\s\s\n/g, '\n\n') + "\n").trim();
    }

    var nameHint = '';

    if (name === undefined) {
      nameHint = '';
    } else if (typeof name === 'string') {
      nameHint = " and name \"" + name + "\"";
    } else {
      nameHint = " and name `" + name + "`";
    }

    return ("\nUnable to find an " + (hidden === false ? 'accessible ' : '') + "element with the role \"" + role + "\"" + nameHint + "\n\n" + roleMessage).trim();
  };

  var queryAllByRoleWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByRole, queryAllByRole.name, 'queryAll');

  var _buildQueries$1 = buildQueries(queryAllByRole, getMultipleError$1, getMissingError$1),
      queryByRole = _buildQueries$1[0],
      getAllByRole = _buildQueries$1[1],
      getByRole = _buildQueries$1[2],
      findAllByRole = _buildQueries$1[3],
      findByRole = _buildQueries$1[4];

  var getTestIdAttribute = function getTestIdAttribute() {
    return getConfig().testIdAttribute;
  };

  var queryAllByTestId = function queryAllByTestId() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    checkContainerType(args[0]);
    return queryAllByAttribute.apply(void 0, [getTestIdAttribute()].concat(args));
  };

  var getMultipleError = function getMultipleError(c, id) {
    return "Found multiple elements by: [" + getTestIdAttribute() + "=\"" + id + "\"]";
  };

  var getMissingError = function getMissingError(c, id) {
    return "Unable to find an element by: [" + getTestIdAttribute() + "=\"" + id + "\"]";
  };

  var queryAllByTestIdWithSuggestions = wrapAllByQueryWithSuggestion(queryAllByTestId, queryAllByTestId.name, 'queryAll');

  var _buildQueries = buildQueries(queryAllByTestId, getMultipleError, getMissingError),
      queryByTestId = _buildQueries[0],
      getAllByTestId = _buildQueries[1],
      getByTestId = _buildQueries[2],
      findAllByTestId = _buildQueries[3],
      findByTestId = _buildQueries[4];

  var queries = /*#__PURE__*/Object.freeze({
    __proto__: null,
    queryAllByLabelText: queryAllByLabelTextWithSuggestions,
    queryByLabelText: queryByLabelText,
    getAllByLabelText: getAllByLabelTextWithSuggestions,
    getByLabelText: getByLabelTextWithSuggestions,
    findAllByLabelText: findAllByLabelText,
    findByLabelText: findByLabelText,
    queryByPlaceholderText: queryByPlaceholderText,
    queryAllByPlaceholderText: queryAllByPlaceholderTextWithSuggestions,
    getByPlaceholderText: getByPlaceholderText,
    getAllByPlaceholderText: getAllByPlaceholderText,
    findAllByPlaceholderText: findAllByPlaceholderText,
    findByPlaceholderText: findByPlaceholderText,
    queryByText: queryByText,
    queryAllByText: queryAllByTextWithSuggestions,
    getByText: getByText,
    getAllByText: getAllByText,
    findAllByText: findAllByText,
    findByText: findByText,
    queryByDisplayValue: queryByDisplayValue,
    queryAllByDisplayValue: queryAllByDisplayValueWithSuggestions,
    getByDisplayValue: getByDisplayValue,
    getAllByDisplayValue: getAllByDisplayValue,
    findAllByDisplayValue: findAllByDisplayValue,
    findByDisplayValue: findByDisplayValue,
    queryByAltText: queryByAltText,
    queryAllByAltText: queryAllByAltTextWithSuggestions,
    getByAltText: getByAltText,
    getAllByAltText: getAllByAltText,
    findAllByAltText: findAllByAltText,
    findByAltText: findByAltText,
    queryByTitle: queryByTitle,
    queryAllByTitle: queryAllByTitleWithSuggestions,
    getByTitle: getByTitle,
    getAllByTitle: getAllByTitle,
    findAllByTitle: findAllByTitle,
    findByTitle: findByTitle,
    queryByRole: queryByRole,
    queryAllByRole: queryAllByRoleWithSuggestions,
    getAllByRole: getAllByRole,
    getByRole: getByRole,
    findAllByRole: findAllByRole,
    findByRole: findByRole,
    queryByTestId: queryByTestId,
    queryAllByTestId: queryAllByTestIdWithSuggestions,
    getByTestId: getByTestId,
    getAllByTestId: getAllByTestId,
    findAllByTestId: findAllByTestId,
    findByTestId: findByTestId
  });
  /**
   * @typedef {{[key: string]: Function}} FuncMap
   */

  /**
   * @param {HTMLElement} element container
   * @param {FuncMap} queries object of functions
   * @param {Object} initialValue for reducer
   * @returns {FuncMap} returns object of functions bound to container
   */

  function getQueriesForElement(element, queries$1, initialValue) {
    if (queries$1 === void 0) {
      queries$1 = queries;
    }

    if (initialValue === void 0) {
      initialValue = {};
    }

    return Object.keys(queries$1).reduce(function (helpers, key) {
      var fn = queries$1[key];
      helpers[key] = fn.bind(null, element);
      return helpers;
    }, initialValue);
  }

  var isRemoved = function isRemoved(result) {
    return !result || Array.isArray(result) && !result.length;
  }; // Check if the element is not present.
  // As the name implies, waitForElementToBeRemoved should check `present` --> `removed`


  function initialCheck(elements) {
    if (isRemoved(elements)) {
      throw new Error('The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.');
    }
  }

  function waitForElementToBeRemoved(_x, _x2) {
    return _waitForElementToBeRemoved.apply(this, arguments);
  }

  function _waitForElementToBeRemoved() {
    _waitForElementToBeRemoved = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(callback, options) {
      var timeoutError, elements, getRemainingElements;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // created here so we get a nice stacktrace
              timeoutError = new Error('Timed out in waitForElementToBeRemoved.');

              if (typeof callback !== 'function') {
                initialCheck(callback);
                elements = Array.isArray(callback) ? callback : [callback];
                getRemainingElements = elements.map(function (element) {
                  var parent = element.parentElement;
                  if (parent === null) return function () {
                    return null;
                  };

                  while (parent.parentElement) {
                    parent = parent.parentElement;
                  }

                  return function () {
                    return parent.contains(element) ? element : null;
                  };
                });

                callback = function callback() {
                  return getRemainingElements.map(function (c) {
                    return c();
                  }).filter(Boolean);
                };
              }

              initialCheck(callback());
              return _context.abrupt("return", waitForWrapper(function () {
                var result;

                try {
                  result = callback();
                } catch (error) {
                  if (error.name === 'TestingLibraryElementError') {
                    return undefined;
                  }

                  throw error;
                }

                if (!isRemoved(result)) {
                  throw timeoutError;
                }

                return undefined;
              }, options));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _waitForElementToBeRemoved.apply(this, arguments);
  }
  /*
  eslint
    require-await: "off"
  */


  var eventMap = {
    // Clipboard Events
    copy: {
      EventType: 'ClipboardEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    cut: {
      EventType: 'ClipboardEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    paste: {
      EventType: 'ClipboardEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    // Composition Events
    compositionEnd: {
      EventType: 'CompositionEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    compositionStart: {
      EventType: 'CompositionEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    compositionUpdate: {
      EventType: 'CompositionEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    // Keyboard Events
    keyDown: {
      EventType: 'KeyboardEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        charCode: 0,
        composed: true
      }
    },
    keyPress: {
      EventType: 'KeyboardEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        charCode: 0,
        composed: true
      }
    },
    keyUp: {
      EventType: 'KeyboardEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        charCode: 0,
        composed: true
      }
    },
    // Focus Events
    focus: {
      EventType: 'FocusEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false,
        composed: true
      }
    },
    blur: {
      EventType: 'FocusEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false,
        composed: true
      }
    },
    focusIn: {
      EventType: 'FocusEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    focusOut: {
      EventType: 'FocusEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    // Form Events
    change: {
      EventType: 'Event',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    input: {
      EventType: 'InputEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    invalid: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: true
      }
    },
    submit: {
      EventType: 'Event',
      defaultInit: {
        bubbles: true,
        cancelable: true
      }
    },
    reset: {
      EventType: 'Event',
      defaultInit: {
        bubbles: true,
        cancelable: true
      }
    },
    // Mouse Events
    click: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        button: 0,
        composed: true
      }
    },
    contextMenu: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    dblClick: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    drag: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    dragEnd: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    dragEnter: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    dragExit: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    dragLeave: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    dragOver: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    dragStart: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    drop: {
      EventType: 'DragEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    mouseDown: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    mouseEnter: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false,
        composed: true
      }
    },
    mouseLeave: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false,
        composed: true
      }
    },
    mouseMove: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    mouseOut: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    mouseOver: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    mouseUp: {
      EventType: 'MouseEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    // Selection Events
    select: {
      EventType: 'Event',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    // Touch Events
    touchCancel: {
      EventType: 'TouchEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    touchEnd: {
      EventType: 'TouchEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    touchMove: {
      EventType: 'TouchEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    touchStart: {
      EventType: 'TouchEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    // UI Events
    resize: {
      EventType: 'UIEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    scroll: {
      EventType: 'UIEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    // Wheel Events
    wheel: {
      EventType: 'WheelEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    // Media Events
    abort: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    canPlay: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    canPlayThrough: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    durationChange: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    emptied: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    encrypted: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    ended: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    loadedData: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    loadedMetadata: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    loadStart: {
      EventType: 'ProgressEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    pause: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    play: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    playing: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    progress: {
      EventType: 'ProgressEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    rateChange: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    seeked: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    seeking: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    stalled: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    suspend: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    timeUpdate: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    volumeChange: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    waiting: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    // Image Events
    load: {
      EventType: 'UIEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    error: {
      EventType: 'Event',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    // Animation Events
    animationStart: {
      EventType: 'AnimationEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    animationEnd: {
      EventType: 'AnimationEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    animationIteration: {
      EventType: 'AnimationEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    // Transition Events
    transitionCancel: {
      EventType: 'TransitionEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    transitionEnd: {
      EventType: 'TransitionEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true
      }
    },
    transitionRun: {
      EventType: 'TransitionEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    transitionStart: {
      EventType: 'TransitionEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    },
    // pointer events
    pointerOver: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    pointerEnter: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    pointerDown: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    pointerMove: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    pointerUp: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    pointerCancel: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    pointerOut: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    },
    pointerLeave: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: false,
        cancelable: false
      }
    },
    gotPointerCapture: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    lostPointerCapture: {
      EventType: 'PointerEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false,
        composed: true
      }
    },
    // history events
    popState: {
      EventType: 'PopStateEvent',
      defaultInit: {
        bubbles: true,
        cancelable: false
      }
    }
  };
  var eventAliasMap = {
    doubleClick: 'dblClick'
  };
  var _excluded = ["value", "files"],
      _excluded2 = ["bubbles", "cancelable", "detail"];

  function fireEvent$1(element, event) {
    return getConfig().eventWrapper(function () {
      if (!event) {
        throw new Error("Unable to fire an event - please provide an event object.");
      }

      if (!element) {
        throw new Error("Unable to fire a \"" + event.type + "\" event - please provide a DOM element.");
      }

      return element.dispatchEvent(event);
    });
  }

  function createEvent(eventName, node, init, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$EventType = _ref.EventType,
        EventType = _ref$EventType === void 0 ? 'Event' : _ref$EventType,
        _ref$defaultInit = _ref.defaultInit,
        defaultInit = _ref$defaultInit === void 0 ? {} : _ref$defaultInit;

    if (!node) {
      throw new Error("Unable to fire a \"" + eventName + "\" event - please provide a DOM element.");
    }

    var eventInit = _extends({}, defaultInit, init);

    var _eventInit$target = eventInit.target;
    _eventInit$target = _eventInit$target === void 0 ? {} : _eventInit$target;

    var value = _eventInit$target.value,
        files = _eventInit$target.files,
        targetProperties = _objectWithoutPropertiesLoose(_eventInit$target, _excluded);

    if (value !== undefined) {
      setNativeValue(node, value);
    }

    if (files !== undefined) {
      // input.files is a read-only property so this is not allowed:
      // input.files = [file]
      // so we have to use this workaround to set the property
      Object.defineProperty(node, 'files', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: files
      });
    }

    Object.assign(node, targetProperties);
    var window = getWindowFromNode(node);
    var EventConstructor = window[EventType] || window.Event;
    var event;
    /* istanbul ignore else  */

    if (typeof EventConstructor === 'function') {
      event = new EventConstructor(eventName, eventInit);
    } else {
      // IE11 polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
      event = window.document.createEvent(EventType);

      var bubbles = eventInit.bubbles,
          cancelable = eventInit.cancelable,
          detail = eventInit.detail,
          otherInit = _objectWithoutPropertiesLoose(eventInit, _excluded2);

      event.initEvent(eventName, bubbles, cancelable, detail);
      Object.keys(otherInit).forEach(function (eventKey) {
        event[eventKey] = otherInit[eventKey];
      });
    } // DataTransfer is not supported in jsdom: https://github.com/jsdom/jsdom/issues/1568


    var dataTransferProperties = ['dataTransfer', 'clipboardData'];
    dataTransferProperties.forEach(function (dataTransferKey) {
      var dataTransferValue = eventInit[dataTransferKey];

      if (typeof dataTransferValue === 'object') {
        /* istanbul ignore if  */
        if (typeof window.DataTransfer === 'function') {
          Object.defineProperty(event, dataTransferKey, {
            value: Object.getOwnPropertyNames(dataTransferValue).reduce(function (acc, propName) {
              Object.defineProperty(acc, propName, {
                value: dataTransferValue[propName]
              });
              return acc;
            }, new window.DataTransfer())
          });
        } else {
          Object.defineProperty(event, dataTransferKey, {
            value: dataTransferValue
          });
        }
      }
    });
    return event;
  }

  Object.keys(eventMap).forEach(function (key) {
    var _eventMap$key = eventMap[key],
        EventType = _eventMap$key.EventType,
        defaultInit = _eventMap$key.defaultInit;
    var eventName = key.toLowerCase();

    createEvent[key] = function (node, init) {
      return createEvent(eventName, node, init, {
        EventType: EventType,
        defaultInit: defaultInit
      });
    };

    fireEvent$1[key] = function (node, init) {
      return fireEvent$1(node, createEvent[key](node, init));
    };
  }); // function written after some investigation here:
  // https://github.com/facebook/react/issues/10135#issuecomment-401496776

  function setNativeValue(element, value) {
    var _ref2 = Object.getOwnPropertyDescriptor(element, 'value') || {},
        valueSetter = _ref2.set;

    var prototype = Object.getPrototypeOf(element);

    var _ref3 = Object.getOwnPropertyDescriptor(prototype, 'value') || {},
        prototypeValueSetter = _ref3.set;

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      /* istanbul ignore if */
      // eslint-disable-next-line no-lonely-if -- Can't be ignored by istanbul otherwise
      if (valueSetter) {
        valueSetter.call(element, value);
      } else {
        throw new Error('The given element does not have a value setter');
      }
    }
  }

  Object.keys(eventAliasMap).forEach(function (aliasKey) {
    var key = eventAliasMap[aliasKey];

    fireEvent$1[aliasKey] = function () {
      return fireEvent$1[key].apply(fireEvent$1, arguments);
    };
  });
  /* eslint complexity:["error", 9] */

  function unindent(string) {
    // remove white spaces first, to save a few bytes.
    // testing-playground will reformat on load any ways.
    return string.replace(/[ \t]*[\n][ \t]*/g, '\n');
  }

  function encode(value) {
    return lzString.exports.compressToEncodedURIComponent(unindent(value));
  }

  function getPlaygroundUrl(markup) {
    return "https://testing-playground.com/#markup=" + encode(markup);
  }

  var debug = function debug(element, maxLength, options) {
    return Array.isArray(element) ? element.forEach(function (el) {
      return logDOM(el, maxLength, options);
    }) : logDOM(element, maxLength, options);
  };

  var logTestingPlaygroundURL = function logTestingPlaygroundURL(element) {
    if (element === void 0) {
      element = getDocument().body;
    } // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition


    if (!element || !('innerHTML' in element)) {
      console.log("The element you're providing isn't a valid DOM element.");
      return;
    } // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition


    if (!element.innerHTML) {
      console.log("The provided element doesn't have any children.");
      return;
    }

    console.log("Open this URL in your browser\n\n" + getPlaygroundUrl(element.innerHTML));
  };

  var initialValue = {
    debug: debug,
    logTestingPlaygroundURL: logTestingPlaygroundURL
  };
  var screen = typeof document !== 'undefined' && document.body // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  ? getQueriesForElement(document.body, queries, initialValue) : Object.keys(queries).reduce(function (helpers, key) {
    // `key` is for all intents and purposes the type of keyof `helpers`, which itself is the type of `initialValue` plus incoming properties from `queries`
    // if `Object.keys(something)` returned Array<keyof typeof something> this explicit type assertion would not be necessary
    // see https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript
    helpers[key] = function () {
      throw new TypeError('For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error');
    };

    return helpers;
  }, initialValue);

  var reactAct = testUtils__namespace.act;
  var actSupported = reactAct !== undefined; // act is supported react-dom@16.8.0
  // so for versions that don't have act from test utils
  // we do this little polyfill. No warnings, but it's
  // better than nothing.

  function actPolyfill(cb) {
    ReactDOM__default["default"].unstable_batchedUpdates(cb);
    ReactDOM__default["default"].render( /*#__PURE__*/React__namespace.createElement("div", null), document.createElement('div'));
  }

  var act = reactAct || actPolyfill;
  var youHaveBeenWarned = false;
  var isAsyncActSupported = null;

  function asyncAct(cb) {
    if (actSupported === true) {
      if (isAsyncActSupported === null) {
        return new Promise(function (resolve, reject) {
          // patch console.error here
          var originalConsoleError = console.error;

          console.error = function error() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            /* if console.error fired *with that specific message* */

            /* istanbul ignore next */
            var firstArgIsString = typeof args[0] === 'string';

            if (firstArgIsString && args[0].indexOf('Warning: Do not await the result of calling ReactTestUtils.act') === 0) {
              // v16.8.6
              isAsyncActSupported = false;
            } else if (firstArgIsString && args[0].indexOf('Warning: The callback passed to ReactTestUtils.act(...) function must not return anything') === 0) ; else {
              originalConsoleError.apply(console, args);
            }
          };

          var cbReturn, result;

          try {
            result = reactAct(function () {
              cbReturn = cb();
              return cbReturn;
            });
          } catch (err) {
            console.error = originalConsoleError;
            reject(err);
            return;
          }

          result.then(function () {
            console.error = originalConsoleError; // if it got here, it means async act is supported

            isAsyncActSupported = true;
            resolve();
          }, function (err) {
            console.error = originalConsoleError;
            isAsyncActSupported = true;
            reject(err);
          }); // 16.8.6's act().then() doesn't call a resolve handler, so we need to manually flush here, sigh

          if (isAsyncActSupported === false) {
            console.error = originalConsoleError;
            /* istanbul ignore next */

            if (!youHaveBeenWarned) {
              // if act is supported and async act isn't and they're trying to use async
              // act, then they need to upgrade from 16.8 to 16.9.
              // This is a seamless upgrade, so we'll add a warning
              console.error("It looks like you're using a version of react-dom that supports the \"act\" function, but not an awaitable version of \"act\" which you will need. Please upgrade to at least react-dom@16.9.0 to remove this warning.");
              youHaveBeenWarned = true;
            }

            cbReturn.then(function () {
              // a faux-version.
              // todo - copy https://github.com/facebook/react/blob/master/packages/shared/enqueueTask.js
              Promise.resolve().then(function () {
                // use sync act to flush effects
                act(function () {});
                resolve();
              });
            }, reject);
          }
        });
      } else if (isAsyncActSupported === false) {
        // use the polyfill directly
        var _result;

        act(function () {
          _result = cb();
        });
        return _result.then(function () {
          return Promise.resolve().then(function () {
            // use sync act to flush effects
            act(function () {});
          });
        });
      } // all good! regular act


      return act(cb);
    } // use the polyfill


    var result;
    act(function () {
      result = cb();
    });
    return result.then(function () {
      return Promise.resolve().then(function () {
        // use sync act to flush effects
        act(function () {});
      });
    });
  }
  /* eslint no-console:0 */

  // dom-testing-library's version of fireEvent. The reason
  // we make this distinction however is because we have
  // a few extra events that work a bit differently

  var fireEvent = function fireEvent() {
    return fireEvent$1.apply(void 0, arguments);
  };

  Object.keys(fireEvent$1).forEach(function (key) {
    fireEvent[key] = function () {
      return fireEvent$1[key].apply(fireEvent$1, arguments);
    };
  }); // React event system tracks native mouseOver/mouseOut events for
  // running onMouseEnter/onMouseLeave handlers
  // @link https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/events/EnterLeaveEventPlugin.js#L24-L31

  var mouseEnter = fireEvent.mouseEnter;
  var mouseLeave = fireEvent.mouseLeave;

  fireEvent.mouseEnter = function () {
    mouseEnter.apply(void 0, arguments);
    return fireEvent.mouseOver.apply(fireEvent, arguments);
  };

  fireEvent.mouseLeave = function () {
    mouseLeave.apply(void 0, arguments);
    return fireEvent.mouseOut.apply(fireEvent, arguments);
  };

  var pointerEnter = fireEvent.pointerEnter;
  var pointerLeave = fireEvent.pointerLeave;

  fireEvent.pointerEnter = function () {
    pointerEnter.apply(void 0, arguments);
    return fireEvent.pointerOver.apply(fireEvent, arguments);
  };

  fireEvent.pointerLeave = function () {
    pointerLeave.apply(void 0, arguments);
    return fireEvent.pointerOut.apply(fireEvent, arguments);
  };

  var select = fireEvent.select;

  fireEvent.select = function (node, init) {
    select(node, init); // React tracks this event only on focused inputs

    node.focus(); // React creates this event when one of the following native events happens
    // - contextMenu
    // - mouseUp
    // - dragEnd
    // - keyUp
    // - keyDown
    // so we can use any here
    // @link https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/events/SelectEventPlugin.js#L203-L224

    fireEvent.keyUp(node, init);
  }; // React event system tracks native focusout/focusin events for
  // running blur/focus handlers
  // @link https://github.com/facebook/react/pull/19186


  var blur = fireEvent.blur;
  var focus = fireEvent.focus;

  fireEvent.blur = function () {
    fireEvent.focusOut.apply(fireEvent, arguments);
    return blur.apply(void 0, arguments);
  };

  fireEvent.focus = function () {
    fireEvent.focusIn.apply(fireEvent, arguments);
    return focus.apply(void 0, arguments);
  };

  configure({
    asyncWrapper: function () {
      var _asyncWrapper = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(cb) {
        var result;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return asyncAct( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
                  return regenerator.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return cb();

                        case 2:
                          result = _context.sent;

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })));

              case 2:
                return _context2.abrupt("return", result);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function asyncWrapper(_x) {
        return _asyncWrapper.apply(this, arguments);
      }

      return asyncWrapper;
    }(),
    eventWrapper: function eventWrapper(cb) {
      var result;
      act(function () {
        result = cb();
      });
      return result;
    }
  });
  var mountedContainers = new Set();

  function render(ui, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        container = _ref2.container,
        _ref2$baseElement = _ref2.baseElement,
        baseElement = _ref2$baseElement === void 0 ? container : _ref2$baseElement,
        queries = _ref2.queries,
        _ref2$hydrate = _ref2.hydrate,
        hydrate = _ref2$hydrate === void 0 ? false : _ref2$hydrate,
        WrapperComponent = _ref2.wrapper;

    if (!baseElement) {
      // default to document.body instead of documentElement to avoid output of potentially-large
      // head elements (such as JSS style blocks) in debug output
      baseElement = document.body;
    }

    if (!container) {
      container = baseElement.appendChild(document.createElement('div'));
    } // we'll add it to the mounted containers regardless of whether it's actually
    // added to document.body so the cleanup method works regardless of whether
    // they're passing us a custom container or not.


    mountedContainers.add(container);

    var wrapUiIfNeeded = function wrapUiIfNeeded(innerElement) {
      return WrapperComponent ? /*#__PURE__*/React__namespace.createElement(WrapperComponent, null, innerElement) : innerElement;
    };

    act(function () {
      if (hydrate) {
        ReactDOM__default["default"].hydrate(wrapUiIfNeeded(ui), container);
      } else {
        ReactDOM__default["default"].render(wrapUiIfNeeded(ui), container);
      }
    });
    return _extends({
      container: container,
      baseElement: baseElement,
      debug: function debug(el, maxLength, options) {
        if (el === void 0) {
          el = baseElement;
        }

        return Array.isArray(el) ? // eslint-disable-next-line no-console
        el.forEach(function (e) {
          return console.log(prettyDOM(e, maxLength, options));
        }) : // eslint-disable-next-line no-console,
        console.log(prettyDOM(el, maxLength, options));
      },
      unmount: function unmount() {
        act(function () {
          ReactDOM__default["default"].unmountComponentAtNode(container);
        });
      },
      rerender: function rerender(rerenderUi) {
        render(wrapUiIfNeeded(rerenderUi), {
          container: container,
          baseElement: baseElement
        }); // Intentionally do not return anything to avoid unnecessarily complicating the API.
        // folks can use all the same utilities we return in the first place that are bound to the container
      },
      asFragment: function asFragment() {
        /* istanbul ignore else (old jsdom limitation) */
        if (typeof document.createRange === 'function') {
          return document.createRange().createContextualFragment(container.innerHTML);
        } else {
          var template = document.createElement('template');
          template.innerHTML = container.innerHTML;
          return template.content;
        }
      }
    }, getQueriesForElement(baseElement, queries));
  }

  function cleanup() {
    mountedContainers.forEach(cleanupAtContainer);
  } // maybe one day we'll expose this (perhaps even as a utility returned by render).
  // but let's wait until someone asks for it.


  function cleanupAtContainer(container) {
    act(function () {
      ReactDOM__default["default"].unmountComponentAtNode(container);
    });

    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }

    mountedContainers.delete(container);
  } // just re-export everything from dom-testing-library
  // thing for people using react-dom@16.8.0. Anyone else doesn't need it and
  // people should just upgrade anyway.

  /* eslint func-name-matching:0 */

  exports.act = act;
  exports.buildQueries = buildQueries;
  exports.cleanup = cleanup;
  exports.configure = configure;
  exports.createEvent = createEvent;
  exports.findAllByAltText = findAllByAltText;
  exports.findAllByDisplayValue = findAllByDisplayValue;
  exports.findAllByLabelText = findAllByLabelText;
  exports.findAllByPlaceholderText = findAllByPlaceholderText;
  exports.findAllByRole = findAllByRole;
  exports.findAllByTestId = findAllByTestId;
  exports.findAllByText = findAllByText;
  exports.findAllByTitle = findAllByTitle;
  exports.findByAltText = findByAltText;
  exports.findByDisplayValue = findByDisplayValue;
  exports.findByLabelText = findByLabelText;
  exports.findByPlaceholderText = findByPlaceholderText;
  exports.findByRole = findByRole;
  exports.findByTestId = findByTestId;
  exports.findByText = findByText;
  exports.findByTitle = findByTitle;
  exports.fireEvent = fireEvent;
  exports.getAllByAltText = getAllByAltText;
  exports.getAllByDisplayValue = getAllByDisplayValue;
  exports.getAllByLabelText = getAllByLabelTextWithSuggestions;
  exports.getAllByPlaceholderText = getAllByPlaceholderText;
  exports.getAllByRole = getAllByRole;
  exports.getAllByTestId = getAllByTestId;
  exports.getAllByText = getAllByText;
  exports.getAllByTitle = getAllByTitle;
  exports.getByAltText = getByAltText;
  exports.getByDisplayValue = getByDisplayValue;
  exports.getByLabelText = getByLabelTextWithSuggestions;
  exports.getByPlaceholderText = getByPlaceholderText;
  exports.getByRole = getByRole;
  exports.getByTestId = getByTestId;
  exports.getByText = getByText;
  exports.getByTitle = getByTitle;
  exports.getConfig = getConfig;
  exports.getDefaultNormalizer = getDefaultNormalizer;
  exports.getElementError = getElementError;
  exports.getMultipleElementsFoundError = getMultipleElementsFoundError;
  exports.getNodeText = getNodeText;
  exports.getQueriesForElement = getQueriesForElement;
  exports.getRoles = getRoles;
  exports.getSuggestedQuery = getSuggestedQuery;
  exports.isInaccessible = isInaccessible;
  exports.logDOM = logDOM;
  exports.logRoles = logRoles;
  exports.makeFindQuery = makeFindQuery;
  exports.makeGetAllQuery = makeGetAllQuery;
  exports.makeSingleQuery = makeSingleQuery;
  exports.prettyDOM = prettyDOM;
  exports.prettyFormat = index;
  exports.queries = queries;
  exports.queryAllByAltText = queryAllByAltTextWithSuggestions;
  exports.queryAllByAttribute = queryAllByAttribute;
  exports.queryAllByDisplayValue = queryAllByDisplayValueWithSuggestions;
  exports.queryAllByLabelText = queryAllByLabelTextWithSuggestions;
  exports.queryAllByPlaceholderText = queryAllByPlaceholderTextWithSuggestions;
  exports.queryAllByRole = queryAllByRoleWithSuggestions;
  exports.queryAllByTestId = queryAllByTestIdWithSuggestions;
  exports.queryAllByText = queryAllByTextWithSuggestions;
  exports.queryAllByTitle = queryAllByTitleWithSuggestions;
  exports.queryByAltText = queryByAltText;
  exports.queryByAttribute = queryByAttribute;
  exports.queryByDisplayValue = queryByDisplayValue;
  exports.queryByLabelText = queryByLabelText;
  exports.queryByPlaceholderText = queryByPlaceholderText;
  exports.queryByRole = queryByRole;
  exports.queryByTestId = queryByTestId;
  exports.queryByText = queryByText;
  exports.queryByTitle = queryByTitle;
  exports.queryHelpers = queryHelpers;
  exports.render = render;
  exports.screen = screen;
  exports.waitFor = waitForWrapper;
  exports.waitForElementToBeRemoved = waitForElementToBeRemoved;
  exports.within = getQueriesForElement;
  exports.wrapAllByQueryWithSuggestion = wrapAllByQueryWithSuggestion;
  exports.wrapSingleQueryWithSuggestion = wrapSingleQueryWithSuggestion;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react.pure.umd.js.map

/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

const path = require('path');

const { createDebugLogger, formatJoinMessage } = require('./debug');
const fsUtils = require('./fs-utils');

const ITERATION_SAFETY_LIMIT = 100e3;

/**
 * Wrap a function such that it always returns a generator of tuple elements.
 *
 * @param {function({uri:string},...):(Array|Iterator)<[string,string]|string>} fn The function to wrap
 * @returns {function({uri:string},...):(Array|Iterator)<[string,string]>} A function that always returns tuple elements
 */
const asGenerator = (fn) => {
  const toTuple = (defaults) => (value) => {
    const partial = [].concat(value);
    return [...partial, ...defaults.slice(partial.length)];
  };

  const isTupleUnique = (v, i, a) => {
    const required = v.join(',');
    return a.findIndex((vv) => vv.join(',') === required) === i;
  };

  return (item, ...rest) => {
    const {uri} = item;
    const mapTuple = toTuple([null, uri]);
    const pending = fn(item, ...rest);
    if (Array.isArray(pending)) {
      return pending.map(mapTuple).filter(isTupleUnique)[Symbol.iterator]();
    } else if (
      pending &&
      (typeof pending === 'object') &&
      (typeof pending.next === 'function') &&
      (pending.next.length === 0)
    ) {
      return pending;
    } else {
      throw new TypeError(`in "join" function expected "generator" to return Array|Iterator`);
    }
  };
};

exports.asGenerator = asGenerator;

/**
 * A high-level utility to create a join function.
 *
 * The `generator` is responsible for ordering possible base paths. The `operation` is responsible for joining a single
 * `base` path with the given `uri`. The `predicate` is responsible for reporting whether the single joined value is
 * successful as the overall result.
 *
 * Both the `generator` and `operation` may be `function*()` or simply `function(...):Array<string>`.
 *
 * @param {function({uri:string, isAbsolute:boolean, bases:{subString:string, value:string, property:string,
 *  selector:string}}, {filename:string, fs:Object, debug:function|boolean, root:string}):
 *  (Array<string>|Iterator<string>)} generator A function that takes the hash of base paths from the `engine` and
 *  returns ordered iterable of paths to consider
 * @returns {function({filename:string, fs:Object, debug:function|boolean, root:string}):
 *  (function({uri:string, isAbsolute:boolean, bases:{subString:string, value:string, property:string,
 *  selector:string}}):string)} join implementation
 */
const createJoinImplementation = (generator) => (item, options, loader) => {
  const { isAbsolute } = item;
  const { root } = options;
  const { fs } = loader;

  // generate the iterator
  const iterator = generator(item, options, loader);
  const isValidIterator = iterator && typeof iterator === 'object' && typeof iterator.next === 'function';
  if (!isValidIterator) {
    throw new Error('expected generator to return Iterator');
  }

  // run the iterator lazily and record attempts
  const { isFileSync, isDirectorySync } = fsUtils(fs);
  const attempts = [];
  for (let i = 0; i < ITERATION_SAFETY_LIMIT; i++) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    } else if (value) {
      const tuple = Array.isArray(value) && value.length === 2 ? value : null;
      if (!tuple) {
        throw new Error('expected Iterator values to be tuple of [string,string], do you need asGenerator utility?');
      }

      // skip elements where base or uri is non-string
      // noting that we need to support base="" when root=""
      const [base, uri] = value;
      if ((typeof base === 'string') && (typeof uri === 'string')) {

        // validate
        const isValidBase = (isAbsolute && base === root) || (path.isAbsolute(base) && isDirectorySync(base));
        if (!isValidBase) {
          throw new Error(`expected "base" to be absolute path to a valid directory, got "${base}"`);
        }

        // make the attempt
        const joined = path.normalize(path.join(base, uri));
        const isFallback = true;
        const isSuccess = isFileSync(joined);
        attempts.push({base, uri, joined, isFallback, isSuccess});

        if (isSuccess) {
          break;
        }

      // validate any non-strings are falsey
      } else {
        const isValidTuple = value.every((v) => (typeof v === 'string') || !v);
        if (!isValidTuple) {
          throw new Error('expected Iterator values to be tuple of [string,string]');
        }
      }
    }
  }

  return attempts;
};

exports.createJoinImplementation = createJoinImplementation;

/**
 * A low-level utility to create a join function.
 *
 * The `implementation` function processes an individual `item` and returns an Array of attempts. Each attempt consists
 * of a `base` and a `joined` value with `isSuccessful` and `isFallback` flags.
 *
 * In the case that any attempt `isSuccessful` then its `joined` value is the outcome. Otherwise the first `isFallback`
 * attempt is used. If there is no successful or fallback attempts then `null` is returned indicating no change to the
 * original URI in the CSS.
 *
 * The `attempts` Array is logged to console when in `debug` mode.
 *
 * @param {string} name Name for the resulting join function
 * @param {function({uri:string, query:string, isAbsolute:boolean, bases:{subString:string, value:string,
 *  property:string, selector:string}}, {filename:string, fs:Object, debug:function|boolean, root:string}):
 *  Array<{base:string,joined:string,fallback?:string,result?:string}>} implementation A function accepts an item and
 *  returns a list of attempts
 * @returns {function({filename:string, fs:Object, debug:function|boolean, root:string}):
 *  (function({uri:string, isAbsolute:boolean, bases:{subString:string, value:string, property:string,
 *  selector:string}}):string)} join function
 */
const createJoinFunction = (name, implementation) => {
  const assertAttempts = (value) => {
    const isValid =
      Array.isArray(value) && value.every((v) =>
        v &&
        (typeof v === 'object') &&
        (typeof v.base === 'string') &&
        (typeof v.uri === 'string') &&
        (typeof v.joined === 'string') &&
        (typeof v.isSuccess === 'boolean') &&
        (typeof v.isFallback === 'boolean')
      );
    if (!isValid) {
      throw new Error(`expected implementation to return Array of {base, uri, joined, isSuccess, isFallback}`);
    } else {
      return value;
    }
  };

  const assertJoined = (value) => {
    const isValid = value && (typeof value === 'string') && path.isAbsolute(value) || (value === null);
    if (!isValid) {
      throw new Error(`expected "joined" to be absolute path, got "${value}"`);
    } else {
      return value;
    }
  };

  const join = (options, loader) => {
    const { debug } = options;
    const { resourcePath } = loader;
    const log = createDebugLogger(debug);

    return (item) => {
      const { uri } = item;
      const attempts = implementation(item, options, loader);
      assertAttempts(attempts, !!debug);

      const { joined: fallback } = attempts.find(({ isFallback }) => isFallback) || {};
      const { joined: result } = attempts.find(({ isSuccess }) => isSuccess) || {};

      log(formatJoinMessage, [resourcePath, uri, attempts]);

      return assertJoined(result || fallback || null);
    };
  };

  const toString = () => '[Function ' + name + ']';

  return Object.assign(join, !!name && {
    toString,
    toJSON: toString
  });
};

exports.createJoinFunction = createJoinFunction;

/**
 * The default iterable factory will order `subString` then `value` then `property` then `selector`.
 *
 * @param {string} uri The uri given in the file webpack is processing
 * @param {boolean} isAbsolute True for absolute URIs, false for relative URIs
 * @param {string} subString A possible base path
 * @param {string} value A possible base path
 * @param {string} property A possible base path
 * @param {string} selector A possible base path
 * @param {string} root The loader options.root value where given
 * @returns {Array<string>} An iterable of possible base paths in preference order
 */
const defaultJoinGenerator = asGenerator(
  ({ uri, isAbsolute, bases: { subString, value, property, selector } }, { root }) =>
    isAbsolute ? [root] : [subString, value, property, selector]
);

exports.defaultJoinGenerator = defaultJoinGenerator;

/**
 * @type {function({filename:string, fs:Object, debug:function|boolean, root:string}):
 *  (function({uri:string, isAbsolute:boolean, bases:{subString:string, value:string, property:string,
 *  selector:string}}):string)} join function
 */
exports.defaultJoin = createJoinFunction(
  'defaultJoin',
  createJoinImplementation(defaultJoinGenerator)
);

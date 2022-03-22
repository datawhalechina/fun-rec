/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

var path        = require('path'),
    loaderUtils = require('loader-utils');

/**
 * Create a value processing function for a given file path.
 *
 * @param {function(Object):string} join The inner join function
 * @param {string} root The loader options.root value where given
 * @param {string} directory The directory of the file webpack is currently processing
 * @return {function} value processing function
 */
function valueProcessor({ join, root, directory }) {
  var URL_STATEMENT_REGEX = /(url\s*\(\s*)(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))(\s*\))/g,
      QUERY_REGEX         = /([?#])/g;

  /**
   * Process the given CSS declaration value.
   *
   * @param {string} value A declaration value that may or may not contain a url() statement
   * @param {function(number):Object} getPathsAtChar Given an offset in the declaration value get a
   *  list of possible absolute path strings
   */
  return function transformValue(value, getPathsAtChar) {

    // allow multiple url() values in the declaration
    //  split by url statements and process the content
    //  additional capture groups are needed to match quotations correctly
    //  escaped quotations are not considered
    return value
      .split(URL_STATEMENT_REGEX)
      .map(initialise)
      .map(eachSplitOrGroup)
      .join('');

    /**
     * Ensure all capture group tokens are a valid string.
     *
     * @param {string|void} token A capture group or uncaptured token
     * @returns {string}
     */
    function initialise(token) {
      return typeof token === 'string' ? token : '';
    }

    /**
     * An Array reduce function that accumulates string length.
     */
    function accumulateLength(accumulator, element) {
      return accumulator + element.length;
    }

    /**
     * Encode the content portion of <code>url()</code> statements.
     * There are 6 capture groups in the split making every 7th unmatched.
     *
     * @param {string} element A single split item
     * @param {number} i The index of the item in the split
     * @param {Array} arr The array of split values
     * @returns {string} Every 3 or 5 items is an encoded url everything else is as is
     */
    function eachSplitOrGroup(element, i, arr) {

      // the content of the url() statement is either in group 3 or group 5
      var mod = i % 7;

      // only one of the capture groups 3 or 5 will match the other will be falsey
      if (element && ((mod === 3) || (mod === 5))) {

        // calculate the offset of the match from the front of the string
        var position = arr.slice(0, i - mod + 1).reduce(accumulateLength, 0);

        // detect quoted url and unescape backslashes
        var before    = arr[i - 1],
            after     = arr[i + 1],
            isQuoted  = (before === after) && ((before === '\'') || (before === '"')),
            unescaped = isQuoted ? element.replace(/\\{2}/g, '\\') : element;

        // split into uri and query/hash and then determine if the uri is some type of file
        var split      = unescaped.split(QUERY_REGEX),
            uri        = split[0],
            query      = split.slice(1).join(''),
            isRelative = testIsRelative(uri),
            isAbsolute = testIsAbsolute(uri);

        // file like URIs are processed but not all URIs are files
        if (isRelative || isAbsolute) {
          var bases    = getPathsAtChar(position), // construct iterator as late as possible in case sourcemap invalid
              absolute = join({ uri, query, isAbsolute, bases });

          if (typeof absolute === 'string') {
            var relative = path.relative(directory, absolute)
              .replace(/\\/g, '/'); // #6 - backslashes are not legal in URI

            return loaderUtils.urlToRequest(relative + query);
          }
        }
      }

      // everything else, including parentheses and quotation (where present) and media statements
      return element;
    }
  };

  /**
   * The loaderUtils.isUrlRequest() doesn't support windows absolute paths on principle. We do not subscribe to that
   * dogma so we add path.isAbsolute() check to allow them.
   *
   * We also eliminate module relative (~) paths.
   *
   * @param {string|undefined} uri A uri string possibly empty or undefined
   * @return {boolean} True for relative uri
   */
  function testIsRelative(uri) {
    return !!uri && loaderUtils.isUrlRequest(uri, false) && !path.isAbsolute(uri) && (uri.indexOf('~') !== 0);
  }

  /**
   * The loaderUtils.isUrlRequest() doesn't support windows absolute paths on principle. We do not subscribe to that
   * dogma so we add path.isAbsolute() check to allow them.
   *
   * @param {string|undefined} uri A uri string possibly empty or undefined
   * @return {boolean} True for absolute uri
   */
  function testIsAbsolute(uri) {
    return !!uri && (typeof root === 'string') && loaderUtils.isUrlRequest(uri, root) &&
      (/^\//.test(uri) || path.isAbsolute(uri));
  }
}

module.exports = valueProcessor;

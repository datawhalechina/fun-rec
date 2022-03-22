/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

var stream = require('stream');

var hasLogged = false;

function logToTestHarness(maybeStream, options) {
  var doLogging =
    !hasLogged &&
    !!maybeStream &&
    (typeof maybeStream === 'object') &&
    (maybeStream instanceof stream.Writable);

  if (doLogging) {
    hasLogged = true; // ensure we log only once
    Object.keys(options).forEach(eachOptionKey);
  }

  function eachOptionKey(key) {
    maybeStream.write(key + ': ' + stringify(options[key]) + '\n');
  }

  function stringify(value) {
    try {
      return JSON.stringify(value) || String(value);
    } catch (e) {
      return '-unstringifyable-';
    }
  }
}

module.exports = logToTestHarness;

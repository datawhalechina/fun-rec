/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

const path = require('path');

const PACKAGE_NAME = require('../../package.json').name;

/**
 * Paths are formatted to have posix style path separators and those within the CWD are made relative to CWD.
 *
 * @param {string} absolutePath An absolute path to format
 * @returns {string} the formatted path
 */
const pathToString = (absolutePath) => {
  if (absolutePath === '') {
    return '-empty-';
  } else {
    const relative = path.relative(process.cwd(), absolutePath).split(path.sep);
    const segments =
      (relative[0] !== '..') ? ['.'].concat(relative).filter(Boolean) :
        (relative.lastIndexOf('..') < 2) ? relative :
          absolutePath.split(path.sep);
    return segments.join('/');
  }
};

exports.pathToString = pathToString;

/**
 * Format a debug message.
 *
 * @param {string} filename The file being processed by webpack
 * @param {string} uri A uri path, relative or absolute
 * @param {Array<{base:string,joined:string,isSuccess:boolean}>} attempts An array of attempts, possibly empty
 * @return {string} Formatted message
 */
const formatJoinMessage = (filename, uri, attempts) => {
  const attemptToCells = (_, i, array) => {
    const { base: prev } = (i === 0) ? {} : array[i-1];
    const { base: curr, joined } = array[i];
    return [(curr === prev) ? '' : pathToString(curr), pathToString(joined)];
  };

  const formatCells = (lines) => {
    const maxWidth = lines.reduce((max, [cellA]) => Math.max(max, cellA.length), 0);
    return lines.map(([cellA, cellB]) => [cellA.padEnd(maxWidth), cellB]).map((cells) => cells.join(' --> '));
  };

  return [PACKAGE_NAME + ': ' + pathToString(filename) + ': ' + uri]
    .concat(attempts.length === 0 ? '-empty-' : formatCells(attempts.map(attemptToCells)))
    .concat(attempts.some(({ isSuccess }) => isSuccess) ? 'FOUND' : 'NOT FOUND')
    .join('\n  ');
};

exports.formatJoinMessage = formatJoinMessage;

/**
 * A factory for a log function predicated on the given debug parameter.
 *
 * The logging function created accepts a function that formats a message and parameters that the function utilises.
 * Presuming the message function may be expensive we only call it if logging is enabled.
 *
 * The log messages are de-duplicated based on the parameters, so it is assumed they are simple types that stringify
 * well.
 *
 * @param {function|boolean} debug A boolean or debug function
 * @return {function(function, array):void} A logging function possibly degenerate
 */
const createDebugLogger = (debug) => {
  const log = !!debug && ((typeof debug === 'function') ? debug : console.log);
  const cache = {};
  return log ?
    ((msgFn, params) => {
      const key = Function.prototype.toString.call(msgFn) + JSON.stringify(params);
      if (!cache[key]) {
        cache[key] = true;
        log(msgFn.apply(null, params));
      }
    }) :
    (() => undefined);
};

exports.createDebugLogger = createDebugLogger;

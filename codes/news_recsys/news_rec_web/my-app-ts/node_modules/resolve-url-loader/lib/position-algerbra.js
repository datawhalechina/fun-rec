/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

/**
 * Given a sourcemap position create a new maybeObject with only line and column properties.
 *
 * @param {*|{line: number, column: number}} maybeObj Possible location hash
 * @returns {{line: number, column: number}} Location hash with possible NaN values
 */
function sanitise(maybeObj) {
  var obj = !!maybeObj && typeof maybeObj === 'object' && maybeObj || {};
  return {
    line: isNaN(obj.line) ? NaN : obj.line,
    column: isNaN(obj.column) ? NaN : obj.column
  };
}

exports.sanitise = sanitise;

/**
 * Infer a line and position delta based on the linebreaks in the given string.
 *
 * @param candidate {string} A string with possible linebreaks
 * @returns {{line: number, column: number}} A position object where line and column are deltas
 */
function strToOffset(candidate) {
  var split = candidate.split(/\r\n|\n/g);
  var last  = split[split.length - 1];
  return {
    line: split.length - 1,
    column: last.length
  };
}

exports.strToOffset = strToOffset;

/**
 * Add together a list of position elements.
 *
 * Lines are added. If the new line is zero the column is added otherwise it is overwritten.
 *
 * @param {{line: number, column: number}[]} list One or more sourcemap position elements to add
 * @returns {{line: number, column: number}} Resultant position element
 */
function add(list) {
  return list
    .slice(1)
    .reduce(
      function (accumulator, element) {
        return {
          line: accumulator.line + element.line,
          column: element.line > 0 ? element.column : accumulator.column + element.column,
        };
      },
      list[0]
    );
}

exports.add = add;

var OptimizationLevel = require('../../../options/optimization-level').OptimizationLevel;

var LOCAL_PREFIX_PATTERN = /^local\(/i;
var QUOTED_PATTERN = /^('.*'|".*")$/;
var QUOTED_BUT_SAFE_PATTERN = /^['"][a-zA-Z][a-zA-Z\d\-_]+['"]$/;

var plugin = {
  level1: {
    value: function textQuotes(_name, value, options) {
      if (!options.level[OptimizationLevel.One].removeQuotes) {
        return value;
      }

      if (!QUOTED_PATTERN.test(value) && !LOCAL_PREFIX_PATTERN.test(value)) {
        return value;
      }

      return QUOTED_BUT_SAFE_PATTERN.test(value) ?
        value.substring(1, value.length - 1) :
        value;
    }
  }
};

module.exports = plugin;

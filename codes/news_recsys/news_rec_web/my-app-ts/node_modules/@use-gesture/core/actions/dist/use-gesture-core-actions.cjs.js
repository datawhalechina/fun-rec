'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./use-gesture-core-actions.cjs.prod.js");
} else {
  module.exports = require("./use-gesture-core-actions.cjs.dev.js");
}
